import React from "react";
import { Link } from "react-router-dom";

// 🔖 categorías base 
const CATEGORIES = [
  { slug: "computadoras", title: "Computadoras", emoji: "💻" },
  { slug: "arma-tu-pc", title: "Armá tu PC", emoji: "🛠️" },
  { slug: "placas", title: "Placas de Video", emoji: "🎮" },
  { slug: "notebooks", title: "Notebooks", emoji: "📓" },
];

export default function CategoryTiles() {
  return (
    <section className="container" style={{ padding: "2rem 0" }}>
      <h2 style={{ marginBottom: "1rem" }}>Explorá por categorías</h2>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="tile"
            style={{
              background: "var(--panel)",
              borderRadius: "var(--radius)",
              padding: "2rem 1rem",
              textAlign: "center",
              boxShadow: "var(--shadow)",
              transition: "transform var(--t), background var(--t)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>
              {cat.emoji}
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>{cat.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
