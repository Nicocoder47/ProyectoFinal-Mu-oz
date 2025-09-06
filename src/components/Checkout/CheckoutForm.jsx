// src/components/CheckoutForm/CheckoutForm.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { createOrder } from "../../services/orders.js";

/* ===== util money ===== */
const money = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);

/* ===== validaciones simples ===== */
const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
const phoneOk = (s) => String(s || "").replace(/[^\d]/g, "").length >= 8;

const STORAGE_KEY = "checkout.buyer";

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, totalPrice, clear } = useCart();

  const [form, setForm] = React.useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {
          name: "",
          phone: "",
          email: "",
          email2: "",
          notes: "",
          accept: false,
        }
      );
    } catch {
      return { name: "", phone: "", email: "", email2: "", notes: "", accept: false };
    }
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [orderId, setOrderId] = React.useState(null);
  const [serverMsg, setServerMsg] = React.useState("");

  /* ------- persistir comprador ------- */
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  /* ------- handlers ------- */
  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Atajo: Ctrl/⌘ + Enter
  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      const btn = document.getElementById("btn-confirmar-compra");
      btn?.click();
    }
  };

  const validate = React.useCallback(() => {
    const e = {};
    if (!form.name?.trim() || form.name.trim().length < 3) e.name = "Ingresá tu nombre completo.";
    if (!phoneOk(form.phone)) e.phone = "Teléfono inválido.";
    if (!emailOk(form.email)) e.email = "Email inválido.";
    if (form.email !== form.email2) e.email2 = "Los emails no coinciden.";
    if (!form.accept) e.accept = "Debés aceptar los términos.";
    if (!items.length) e.cart = "Tu carrito está vacío.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, items.length]);

  const itemCount = React.useMemo(
    () => items.reduce((a, it) => a + (it.quantity ?? it.qty ?? 1), 0),
    [items]
  );

  const canSubmit = !loading && itemCount > 0 && totalPrice > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setServerMsg("");

    if (!validate()) return;
    if (!canSubmit) return;

    setLoading(true);
    try {
      // Estandarizá items con "quantity" para el servicio
      const orderItems = items.map((it) => ({
        id: String(it.id),
        title: it.title,
        price: Number(it.price) || 0,
        quantity: it.quantity ?? it.qty ?? 1,
      }));

      const order = {
        buyer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          notes: form.notes?.trim() || "",
        },
        items: orderItems,
        total: Number(totalPrice) || 0,
        // createdAt lo setea el server (serverTimestamp) en orders.js
        status: "pending",
      };

      // Descontar stock en misma transacción
      const id = await createOrder({ ...order, updateStock: true });
      setOrderId(id);

      // Limpio carrito y datos locales
      clear();
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("❌ Error al generar orden:", err);
      const msg = String(err?.message || "Hubo un problema al procesar tu compra.");
      setServerMsg(msg);

      // Mapeo de errores comunes a campos
      const e = {};
      if (/carrito vacío/i.test(msg)) e.cart = "Tu carrito está vacío.";
      if (/total inválido/i.test(msg)) e.cart = "El total no coincide. Actualizá el carrito e intentá de nuevo.";
      if (/sin stock/i.test(msg)) e.cart = msg; // muestra el título que vino del server
      setErrors((prev) => ({ ...prev, ...e }));
    } finally {
      setLoading(false);
    }
  }

  /* ------- pantalla de éxito ------- */
  if (orderId) {
    const copyId = async () => {
      try {
        await navigator.clipboard.writeText(orderId);
        alert("ID de orden copiado al portapapeles.");
      } catch {
        // noop
      }
    };
    return (
      <section className="container" style={{ padding: "2rem 0" }}>
        <h2>¡Gracias por tu compra!</h2>
        <p>Guardá tu número de orden:</p>
        <p>
          <code style={{ fontSize: "1.1rem" }}>{orderId}</code>
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn-outline" onClick={copyId}>Copiar ID</button>
          <button className="btn-primary" onClick={() => navigate("/")}>Volver al inicio</button>
        </div>
        <p style={{ color: "var(--muted)", marginTop: 12 }}>
          Te enviamos un correo a <strong>{form.email}</strong> con el detalle.
        </p>
      </section>
    );
  }

  /* ------- si el carrito está vacío, sugerí volver ------- */
  const emptyCart = !items.length;

  return (
    <section className="container" style={{ padding: "2rem 0" }}>
      <h2>Finalizar compra</h2>

      {/* Mensaje de servidor accesible */}
      <div aria-live="polite" style={{ minHeight: 20, marginTop: 6, color: serverMsg ? "#ff7b7b" : "inherit" }}>
        {serverMsg && <small>{serverMsg}</small>}
      </div>

      <div className="card" style={{ display: "grid", gap: "1rem", padding: "1.25rem", maxWidth: 820 }}>
        {/* Resumen de compra */}
        <div className="summary" style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--muted)" }}>Items</div>
            <strong>{itemCount}</strong>
          </div>
          <div style={{ flex: 1 }} />
          <div>
            <div style={{ color: "var(--muted)", textAlign: "right" }}>Total</div>
            <strong>{money(totalPrice)}</strong>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} onKeyDown={onKeyDown} style={{ display: "grid", gap: "0.75rem" }} noValidate>
          <label className="field">
            <span>Nombre completo</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={onChange}
              placeholder="Juan Pérez"
              required
              disabled={loading}
            />
            {errors.name && <small className="err">{errors.name}</small>}
          </label>

          <label className="field">
            <span>Teléfono</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={form.phone}
              onChange={onChange}
              placeholder="+54 11 5555-5555"
              required
              disabled={loading}
            />
            {errors.phone && <small className="err">{errors.phone}</small>}
          </label>

          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                placeholder="correo@ejemplo.com"
                required
                disabled={loading}
              />
              {errors.email && <small className="err">{errors.email}</small>}
            </label>

            <label className="field">
              <span>Confirmá tu email</span>
              <input
                type="email"
                name="email2"
                value={form.email2}
                onChange={onChange}
                placeholder="Repetí tu email"
                required
                disabled={loading}
              />
              {errors.email2 && <small className="err">{errors.email2}</small>}
            </label>
          </div>

          <label className="field">
            <span>Notas (opcional)</span>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={onChange}
              placeholder="Aclaraciones de entrega o facturación…"
              disabled={loading}
            />
          </label>

          <label className="checkbox" style={{ gap: 8 }}>
            <input type="checkbox" name="accept" checked={form.accept} onChange={onChange} disabled={loading} />
            <span>Acepto los términos y condiciones</span>
          </label>
          {errors.accept && <small className="err">{errors.accept}</small>}
          {errors.cart && <small className="err">{errors.cart}</small>}

          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button
              id="btn-confirmar-compra"
              className="btn-primary"
              type="submit"
              disabled={!canSubmit || emptyCart}
            >
              {loading ? "Procesando…" : "Confirmar compra"}
            </button>
            <button
              className="btn-outline"
              type="button"
              onClick={() => navigate("/cart")}
              disabled={loading}
            >
              Volver al carrito
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
