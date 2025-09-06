// src/components/ItemDetailContainer/ItemDetailContainer.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/products"; 
import Loader from "../UI/Loader.jsx";
import ItemDetail from "./ItemDetail.jsx";

export default function ItemDetailContainer() {
  const { id } = useParams();
  const [item, setItem] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loader label="Cargando detalle…" />;
  }

  if (!item) {
    return (
      <section className="container" style={{ padding: "2rem 0" }}>
        Producto no encontrado.
      </section>
    );
  }

  return <ItemDetail item={item} />;
}
