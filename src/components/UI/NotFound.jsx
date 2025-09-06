// Página 404 minimalista
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container" style={{ padding: "3rem 0", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: ".5rem" }}>404 — Página no encontrada</h1>
      <p style={{ color: "var(--muted)" }}>
        La ruta que buscás no existe o fue movida.
      </p>
      <div style={{ marginTop: "1.25rem" }}>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    </section>
  );
}
