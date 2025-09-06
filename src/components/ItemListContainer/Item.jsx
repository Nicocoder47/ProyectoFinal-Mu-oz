// src/components/ItemListContainer/Item.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// dinero
const money = (n) =>
  (Number(n) || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// pick
const normalize = (it) => ({
  id: it.id,
  title: it.title ?? "",
  brand: it.brand ?? "",
  price: Number(it.price ?? 0),
  image: it.image ?? it.imageUrl ?? "/img/placeholder.png",
  stock: Number(it.stock ?? 0),
});

export default function Item({ item }) {
  const p = normalize(item);

  return (
    <article className="card" role="listitem" aria-label={p.title}>
      {/* imagen */}
      <Link to={`/item/${p.id}`} className="thumb" style={{ borderRadius: 12 }}>
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/img/placeholder.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            aspectRatio: "4 / 3",
            display: "block",
          }}
        />
      </Link>

      {/* cuerpo */}
      <div className="card-body" style={{ display: "grid", gap: ".6rem" }}>
        <h3 className="card-title" title={p.title} style={{ marginBottom: 2 }}>
          {p.title}
        </h3>

        {p.brand && (
          <small className="brand" style={{ color: "var(--muted)" }}>
            {p.brand}
          </small>
        )}

        <div className="price" style={{ fontWeight: 800, color: "var(--accent)" }}>
          {money(p.price)}
        </div>

        {/* stock */}
        <small style={{ color: p.stock > 0 ? "var(--ok)" : "var(--danger)" }}>
          {p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
        </small>

        {/* acciones */}
        <div className="card-actions" style={{ display: "flex", gap: ".5rem" }}>
          <Link to={`/item/${p.id}`} className="btn-outline" aria-label={`Ver detalle de ${p.title}`}>
            Ver detalle
          </Link>
          <Link
            to={`/item/${p.id}`}
            className="btn-primary"
            aria-label={`Comprar ${p.title}`}
          >
            Comprar
          </Link>
        </div>
      </div>
    </article>
  );
}

// tipos
Item.propTypes = {
  item: PropTypes.object.isRequired,
};
