// src/components/Cart/Cart.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import CartItem from "./CartItem.jsx";

// Formato.
const money = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(n ?? 0);

export default function Cart() {
  // ⬅️ usar los nombres reales del context
  const { items, totalQty, total, clear } = useCart();

  // Debug.
  console.log("CART →", { items, totalQty, total });

  // Vacío.
  if (!items.length) {
    return (
      <section className="container" style={{ padding: "2rem 0" }}>
        <h2 style={{ marginBottom: 8 }}>Tu carrito</h2>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          Aún no agregaste productos.
        </p>
        <Link to="/" className="btn-primary">Ir al catálogo</Link>
      </section>
    );
  }

  return (
    <section className="container" style={{ padding: "2rem 0", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2>Tu carrito</h2>
        <small style={{ color: "var(--muted)" }}>
          {totalQty} {totalQty === 1 ? "unidad" : "unidades"}
        </small>
      </header>

      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: "1rem" }}>
          {items.map((it) => (
            <CartItem key={it.id} item={it} />
          ))}
        </div>
      </div>

      <footer className="card" aria-label="Resumen de compra">
        <div className="card-body" style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total unidades</span>
            <strong>{totalQty}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
            <span>Total a pagar</span>
            <strong>{money(total)}</strong>
          </div>

          <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
            <button className="btn-outline" onClick={clear}>Vaciar carrito</button>
            <Link to="/" className="btn-outline">Seguir comprando</Link>
            <Link to="/checkout" className="btn-primary">Finalizar compra</Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
