import React from "react";
import { Link } from "react-router-dom";
import ItemCount from "./ItemCount.jsx";
import { useCart } from "../../context/CartContext.jsx";

const money = (n) => new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS" }).format(n ?? 0);

export default function ItemDetail({ item }) {
  const { add } = useCart();
  const [added, setAdded] = React.useState(0);

  const onAdd = (qty) => {
    setAdded(qty);
    add({ id: item.id, title: item.title, price: item.price, image: item.image }, qty);
  };

  return (
    <section className="container" style={{padding:"2rem 0"}}>
      <div className="card" style={{display:"grid",gridTemplateColumns:"minmax(280px,420px) 1fr",gap:"1.5rem"}}>
        <div className="thumb-lg" style={{padding:16}}>
          <img
            src={item.image}
            alt={item.title}
            style={{width:"100%",borderRadius:"var(--radius)",background:"var(--bg-2)",objectFit:"cover"}}
          />
        </div>

        <div className="card-body" style={{display:"grid",gap:12}}>
          <h1 style={{fontSize:"1.6rem"}}>{item.title}</h1>
          {item.brand && <p style={{color:"var(--muted)"}}>{item.brand}</p>}
          <p className="price" style={{fontSize:"1.4rem"}}>{money(item.price)}</p>
          {item.description && <p style={{opacity:.9}}>{item.description}</p>}

          {!added ? (
            <ItemCount stock={item.stock ?? 0} initial={1} onAdd={onAdd} />
          ) : (
            <div style={{display:"flex",gap:12,marginTop:8}}>
              <Link to="/cart" className="btn-primary">Ir al carrito</Link>
              <Link to="/" className="btn-outline">Seguir comprando</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
