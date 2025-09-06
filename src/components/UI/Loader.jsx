import React from "react";

/**
 * Loader accesible, elegante y reutilizable.
 * @param {string} label - Texto de carga
 * @param {number} size - Tamaño del spinner en px (default 32)
 * @param {string} color - Color del borde superior del spinner
 */
export default function Loader({ label = "Cargando…", size = 32, color = "var(--accent)" }) {
  const spinnerStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `${size / 8}px solid rgba(255,255,255,0.15)`,
    borderTopColor: color,
    animation: "spin 1s linear infinite",
  };

  const wrapperStyle = {
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    gap: "0.75rem",
    padding: "2rem",
    color: "var(--text)",
    fontSize: "0.95rem",
  };

  return (
    <div role="status" aria-label={label} style={wrapperStyle}>
      <span style={spinnerStyle} />
      <small style={{ color: "var(--muted)" }}>{label}</small>

      {/* Animación inline para no depender de CSS externo */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
