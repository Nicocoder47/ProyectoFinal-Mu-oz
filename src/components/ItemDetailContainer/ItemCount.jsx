import React from "react";

export default function ItemCount({ stock = 0, initial = 1, onAdd }) {
  const [qty, setQty] = React.useState(initial);

  const dec = () => setQty(q => Math.max(1, q - 1));
  const inc = () => setQty(q => Math.min(stock, q + 1));
  const add = () => onAdd?.(qty);

  return (
    <div className="qty" style={{display:"flex",gap:8,alignItems:"center"}}>
      <button onClick={dec} disabled={qty <= 1}>-</button>
      <output aria-live="polite" style={{minWidth:28,textAlign:"center"}}>{qty}</output>
      <button onClick={inc} disabled={qty >= stock}>+</button>
      <button className="btn-primary" onClick={add} disabled={!stock}>Agregar</button>
      {!stock && <small className="muted">Sin stock</small>}
    </div>
  );
}
