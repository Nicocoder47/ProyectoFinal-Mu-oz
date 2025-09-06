import React from "react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section
      className="hero"
      style={{
        background: "linear-gradient(135deg, #0b0e11 0%, #121721 100%)",
        padding: "4rem 1rem",
        color: "var(--text)",
        textAlign: "center",
      }}
    >
      <div className="container" style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--accent)",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          🎮 Spring Sale
        </p>

        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "1rem",
          }}
        >
          Renovate tu setup gamer <br />
          con <span style={{ color: "var(--accent)" }}>hasta 30% OFF</span>
        </h1>

        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "var(--muted)" }}>
          Placas de video, procesadores, notebooks y más.  
          Envíos a todo el país 🚚
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/category/ofertas" className="btn-primary">
            Ver ofertas
          </Link>
          <Link to="/category/arma-tu-pc" className="btn-outline">
            Armá tu PC
          </Link>
        </div>
      </div>
    </section>
  );
}
