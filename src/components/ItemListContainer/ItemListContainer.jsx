// src/components/ItemListContainer/ItemListContainer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getAllProducts } from "../../services/products";
import ItemList from "./ItemList";
import Loader from "../UI/Loader";

// slug
const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ItemListContainer({ greeting }) {
  // estado
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // url
  const params = useParams();
  const [sp] = useSearchParams();
  const q = (sp.get("q") || "").trim().toLowerCase();
  const brandSlug = sp.get("brand") || "";
  const typeSlug = sp.get("type") || "";
  const onlyStock = sp.get("inStock") === "1";

  // categoria
  const cat =
    (params.slug || params.category || params.categoryId || sp.get("category") || "").toString();

  // efecto
  useEffect(() => {
    let alive = true;
    setLoading(true);

    getAllProducts()
      .then((data) => {
        if (!alive) return;
        let out = data;

        // cat
        if (cat) out = out.filter((p) => slug(p.category) === slug(cat));

        // brand
        if (brandSlug) out = out.filter((p) => slug(p.brand) === brandSlug);

        // type
        if (typeSlug) {
          out = out.filter(
            (p) =>
              slug(p.type) === typeSlug ||
              (p.title || "").toLowerCase().includes(typeSlug) ||
              (p.description || "").toLowerCase().includes(typeSlug)
          );
        }

        // search
        if (q) {
          out = out.filter(
            (p) =>
              (p.title || "").toLowerCase().includes(q) ||
              (p.brand || "").toLowerCase().includes(q) ||
              (p.description || "").toLowerCase().includes(q)
          );
        }

        // stock
        if (onlyStock) out = out.filter((p) => Number(p.stock ?? 0) > 0);

        // sort
        out = out.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

        setItems(out);
      })
      .catch((err) => {
        console.error("error productos", err);
        setItems([]);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [cat, q, brandSlug, typeSlug, onlyStock]);

  // render
  if (loading) return <Loader label="Cargando productos..." />;
  if (!items.length)
    return (
      <section style={{ padding: "2rem" }}>
        <h2>{greeting}</h2>
        <p style={{ color: "var(--muted)" }}>No se encontraron productos.</p>
      </section>
    );

  return (
    <section style={{ padding: "2rem" }}>
      <h2>{greeting}</h2>
      <ItemList items={items} />
    </section>
  );
}
