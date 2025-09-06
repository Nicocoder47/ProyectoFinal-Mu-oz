// src/components/ItemListContainer/ItemList.jsx
import React from "react";
import PropTypes from "prop-types";
import Item from "./Item.jsx";

export default function ItemList({ items = [] }) {
  if (!items.length) {
    return (
      <p style={{ padding: "2rem", color: "var(--muted)" }}>
        No hay productos disponibles.
      </p>
    );
  }

  return (
    <div
      className="grid"
      role="list"
      aria-label="Listado de productos"
      style={{ gap: "2rem" }}
    >
      {items.map((it) => (
        <Item key={it.id} item={it} />
      ))}
    </div>
  );
}

// Tipado
ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
