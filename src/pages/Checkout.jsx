// src/pages/Checkout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../services/orders.js"; // paso 3

// Moneda
const money = (n) =>
  (Number(n) || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// Reglas
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[0-9+()\s-]{6,}$/.test(v);

export default function Checkout() {
  // Estado
  const { items, total, clear } = useCart();
  const nav = useNavigate();

  // Form
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    confirm: "",
    phone: "",
    address: "",
    notes: "",
  });

  // UI
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [orderId, setOrderId] = React.useState("");

  // Vacío
  if (!items.length && !orderId) {
    return (
      <div className="container" style={{ padding: "2rem 1rem" }}>
        <h1>Checkout</h1>
        <p style={{ color: "var(--muted)" }}>Tu carrito está vacío.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: 12 }}>
          Volver a comprar
        </Link>
      </div>
    );
  }

  // Cambios
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Validar
  const validate = () => {
    if (!form.name.trim()) return "Nombre requerido";
    if (!isEmail(form.email)) return "Email inválido";
    if (form.email !== form.confirm) return "Los emails no coinciden";
    if (!isPhone(form.phone)) return "Teléfono inválido";
    if (!form.address.trim()) return "Dirección requerida";
    return "";
  };

  // Enviar
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    try {
      setLoading(true);

      // Buyer
      const buyer = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
      };

      // Items
      const orderItems = items.map((it) => ({
        id: it.id,
        title: it.title,
        price: Number(it.price) || 0,
        qty: it.qty,
      }));

      // Crear
      const id = await createOrder({ buyer, items: orderItems, total });

      // OK
      setOrderId(id);
      clear();
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la orden. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Éxito
  if (orderId) {
    return (
      <div className="container" style={{ padding: "2rem 1rem", maxWidth: 700 }}>
        <h1>¡Gracias por tu compra!</h1>
        <p style={{ marginTop: 8 }}>
          Te enviamos un correo con el detalle de la orden.
        </p>

        <div className="card" style={{ padding: "1rem", marginTop: 16 }}>
          <div style={{ fontWeight: 700 }}>ID de orden</div>
          <div style={{ marginTop: 6, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
            {orderId}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Link to="/" className="btn-primary">Seguir comprando</Link>
          <button className="btn-outline" onClick={() => nav("/")}>Inicio</button>
        </div>
      </div>
    );
  }

  // Vista
  return (
    <div className="container" style={{ padding: "2rem 1rem", display: "grid", gap: "1rem" }}>
      <h1>Checkout</h1>

      {/* Resumen */}
      <div className="card" style={{ padding: "1rem", display: "grid", gap: ".5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Productos</span>
          <strong>{items.reduce((a, b) => a + b.qty, 0)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem" }}>
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="card" style={{ padding: "1rem", display: "grid", gap: "0.75rem", maxWidth: 720 }}>
        {/* Error */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.35)",
              color: "#fecaca",
              padding: ".6rem .8rem",
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* Nombre */}
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="name">Nombre y apellido</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Juan Pérez"
            autoComplete="name"
            required
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="tu@correo.com"
            autoComplete="email"
            required
            type="email"
            style={inputStyle}
          />
        </div>

        {/* Confirmación */}
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="confirm">Confirmar email</label>
          <input
            id="confirm"
            name="confirm"
            value={form.confirm}
            onChange={onChange}
            placeholder="tu@correo.com"
            required
            type="email"
            style={inputStyle}
          />
        </div>

        {/* Teléfono */}
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+54 9 11 1234-5678"
            autoComplete="tel"
            required
            style={inputStyle}
          />
        </div>

        {/* Dirección */}
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="address">Dirección</label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Calle 123, Piso 1, Dpto A"
            autoComplete="street-address"
            required
            style={inputStyle}
          />
        </div>

        {/* Notas */}
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={onChange}
            placeholder="Indicaciones para la entrega…"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <Link to="/cart" className="btn-outline" style={{ flex: 1 }}>
            Volver al carrito
          </Link>
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ flex: 1, opacity: loading ? 0.8 : 1 }}
          >
            {loading ? "Procesando…" : "Finalizar compra"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Estilo
const inputStyle = {
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  color: "var(--text)",
  padding: ".7rem .8rem",
  borderRadius: 12,
  outline: "none",
};
