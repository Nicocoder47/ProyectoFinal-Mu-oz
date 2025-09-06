// src/components/CartWidget/CartWidget.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

// Icono
const CartIcon = React.memo(function CartIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.6" fill="currentColor" />
      <circle cx="18" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
});

// SrOnly
const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default function CartWidget() {
  const { totalQty } = useCart();

  // Etiqueta
  const label = React.useMemo(
    () => `Carrito. ${totalQty || 0} ${totalQty === 1 ? "producto" : "productos"}`,
    [totalQty]
  );

  return (
    <Link
      to="/cart"
      className="cart-widget"
      aria-label={label}
      title="Ir al carrito"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: ".55rem",
        padding: ".55rem .8rem",
        borderRadius: 999,
        background: "rgba(255,255,255,.06)",
        color: "var(--text)",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow: "0 6px 18px rgba(0,0,0,.35)",
        transition: "transform .18s ease, box-shadow .18s ease, background .18s ease",
        willChange: "transform",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px) scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(119,224,90,.25)")}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,.35)")}
    >
      <CartIcon />

      {/* Texto */}
      <span style={{ fontWeight: 600 }}>Carrito</span>

      {/* Badge */}
      <span
        aria-hidden="true"
        data-count={totalQty || 0}
        style={{
          minWidth: 22,
          height: 22,
          padding: "0 .4rem",
          borderRadius: 999,
          background: "var(--accent)",
          color: "#000",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: ".85rem",
          lineHeight: 1,
          letterSpacing: ".2px",
          fontFeatureSettings: "'tnum' 1, 'lnum' 1", 
          marginLeft: 6,
          boxShadow: "0 0 0 2px rgba(0,0,0,.35) inset",
        }}
      >
        {totalQty || 0}
      </span>

      {/* Live */}
      <span role="status" aria-live="polite" style={srOnly}>
        {label}
      </span>
    </Link>
  );
}
