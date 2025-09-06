// src/components/Cart/CartDrawer.jsx
import React from "react";
import { useCart } from "../../context/CartContext.jsx";

// Formato
const money = (n) =>
  (Number(n) || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

export default function CartDrawer({ onClose }) {
  const { items, remove, setQty, clear, total } = useCart();

  return (
    <div role="dialog" aria-modal="true" onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:80 }}>
      <aside onClick={(e)=>e.stopPropagation()}
        style={{
          position:"absolute", right:0, top:0, height:"100%", width:"min(420px, 92vw)",
          background:"var(--panel)", borderLeft:"1px solid rgba(255,255,255,.08)",
          boxShadow:"var(--shadow-lg)", padding:"1rem",
          display:"grid", gridTemplateRows:"auto 1fr auto", gap:"1rem"
        }}>
        {/* Título */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ margin:0 }}>Tu carrito</h2>
          <button className="btn-outline" onClick={onClose}>Cerrar</button>
        </div>

        {/* Lista */}
        <div style={{ overflow:"auto", display:"grid", gap:".75rem" }}>
          {items.length === 0 && <p style={{ color:"var(--muted)" }}>Aún no agregaste productos.</p>}

          {items.map(it => (
            <div key={it.id} style={{
              display:"grid", gridTemplateColumns:"64px 1fr auto", gap:".75rem",
              alignItems:"center", background:"var(--bg-2)", borderRadius:12, padding:".5rem"
            }}>
              <img
                src={it.image || "/img/placeholder.png"}
                alt={it.title}
                width={64} height={64}
                style={{ objectFit:"contain", width:64, height:64, borderRadius:10, background:"#0b0e11" }}
                onError={(e)=>{ e.currentTarget.src="/img/placeholder.png"; }}
              />
              <div>
                <div style={{ fontWeight:600 }}>{it.title}</div>
                <small style={{ color:"var(--muted)" }}>{it.brand}</small>
                <div style={{ marginTop:4, color:"var(--accent)", fontWeight:700 }}>{money(it.price)}</div>

                <div style={{ marginTop:6, display:"flex", gap:8, alignItems:"center" }}>
                  <button className="btn-outline" onClick={()=>setQty(it.id, it.qty-1)}>-</button>
                  <input
                    value={it.qty}
                    onChange={(e)=>setQty(it.id, Number(e.target.value)||1)}
                    inputMode="numeric"
                    style={{
                      width:56, textAlign:"center", background:"rgba(255,255,255,.06)",
                      border:"1px solid rgba(255,255,255,.12)", color:"var(--text)",
                      borderRadius:10, padding:"6px 8px"
                    }}
                  />
                  <button className="btn-primary" onClick={()=>setQty(it.id, it.qty+1)}>+</button>
                </div>
              </div>

              <div style={{ display:"grid", gap:8, justifyItems:"end" }}>
                <div style={{ fontWeight:700 }}>{money(it.price * it.qty)}</div>
                <button className="btn-outline" onClick={()=>remove(it.id)}>Quitar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ display:"grid", gap:".75rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700 }}>
            <span>Subtotal</span>
            <span>{money(total)}</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn-outline" onClick={clear} style={{ flex:1 }}>Vaciar</button>
            <button className="btn-primary" style={{ flex:1 }} onClick={()=>alert("Ir a checkout 🚀")}>
              Finalizar compra
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
