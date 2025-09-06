import React from "react";
import { useCart } from "../../context/CartContext.jsx";

// 💲 formato simple
const money = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 }).format(n ?? 0);

export default function CartItem({ item }) {
  const { setQty, remove } = useCart();
  const { id, title, price, qty, image } = item;

  const onChangeQty = (e) => {
    const v = Number(e.target.value);
    // asegura mínimo 1
    setQty(id, Number.isFinite(v) && v > 0 ? v : 1);
  };

  return (
    <div
      className="cart-row"
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr 120px 120px auto",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <img
        src={image}
        alt=""
        width="72"
        height="72"
        className="cart-thumb"
        style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "10px", background: "var(--bg-2)" }}
      />

      <div className="grow" style={{ display: "grid" }}>
        <strong>{title}</strong>
        <small style={{ color: "var(--muted)" }}>{money(price)} c/u</small>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <span className="sr-only">Cantidad</span>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={qty}
          onChange={onChangeQty}
          aria-label={`Cantidad de ${title}`}
          style={{
            width: "100%",
            padding: ".5rem .75rem",
            borderRadius: "10px",
            border: "1px solid #2a3344",
            background: "var(--bg-2)",
            color: "var(--text)",
          }}
        />
      </label>

      <strong aria-label="Subtotal" style={{ justifySelf: "end" }}>
        {money(qty * price)}
      </strong>

      <div style={{ justifySelf: "end" }}>
        <button className="btn-outline" onClick={() => remove(id)} aria-label={`Quitar ${title}`}>
          Quitar
        </button>
      </div>
    </div>
  );
}
