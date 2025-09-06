// src/pages/CartPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

// Moneda
const money = (n) =>
  (Number(n) || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

export default function CartPage() {
  // Estado
  const { items, total, totalQty, setQty, remove, clear } = useCart();
  const nav = useNavigate();

  // Vacío
  if (!items.length) {
    return (
      <div className="container" style={{ padding: "2rem 1rem" }}>
        <h1>Tu carrito</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Aún no agregaste productos.
        </p>
        <Link to="/" className="btn-primary" style={{ marginTop: 12 }}>
          Seguir comprando
        </Link>
      </div>
    );
  }

  // UI
  return (
    <div className="container" style={{ padding: "2rem 1rem", display: "grid", gap: "1rem" }}>
      <h1>Tu carrito</h1>

      {/* Lista */}
      <div style={{ display: "grid", gap: ".75rem" }}>
        {items.map((it) => (
          <div
            key={it.id}
            className="card"
            style={{
              display: "grid",
              gridTemplateColumns: "96px 1fr auto",
              gap: "1rem",
              alignItems: "center",
              padding: ".75rem",
            }}
          >
            <div className="thumb" style={{ width: 96, height: 96, borderRadius: 10 }}>
              <img
                src={it.image || "/img/placeholder.png"}
                alt={it.title}
                width={96}
                height={96}
                onError={(e) => (e.currentTarget.src = "/img/placeholder.png")}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700 }}>{it.title}</div>
              <small style={{ color: "var(--muted)" }}>{it.brand}</small>
              <div style={{ marginTop: 6, color: "var(--accent)", fontWeight: 800 }}>
                {money(it.price)}
              </div>

              <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn-outline" onClick={() => setQty(it.id, it.qty - 1)}>-</button>
                <input
                  value={it.qty}
                  onChange={(e) => setQty(it.id, Number(e.target.value) || 1)}
                  inputMode="numeric"
                  aria-label="Cantidad"
                  style={{
                    width: 64,
                    textAlign: "center",
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.12)",
                    color: "var(--text)",
                    borderRadius: 10,
                    padding: "6px 8px",
                  }}
                />
                <button className="btn-primary" onClick={() => setQty(it.id, it.qty + 1)}>+</button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
              <div style={{ fontWeight: 800 }}>{money(it.price * it.qty)}</div>
              <button className="btn-outline" onClick={() => remove(it.id)}>Quitar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div
        className="card"
        style={{ padding: "1rem", display: "grid", gap: ".75rem", maxWidth: 520, marginLeft: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Productos</span>
          <strong>{totalQty}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem" }}>
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button className="btn-outline" onClick={clear} style={{ flex: 1 }}>
            Vaciar
          </button>
          <button className="btn-primary" onClick={() => nav("/checkout")} style={{ flex: 1 }}>
            Ir al checkout
          </button>
        </div>
      </div>
    </div>
  );
}
