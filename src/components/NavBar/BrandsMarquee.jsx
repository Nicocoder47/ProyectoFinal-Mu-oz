// src/components/NavBar/BrandsMarquee.jsx
import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as icons from "simple-icons/icons";
import "./BrandsMarquee.css";

/* Marcas */
const ICON_KEYS = [
  "siLogitech","siRazer","siNvidia","siAmd","siIntel","siMsi","siAsus",
  "siGigabyte","siCorsair","siSteelseries","siPlaystation","siXbox",
  "siNintendo","siHyperx","siAlienware",
];

/* Color */
const asCurrentColor = (svg) =>
  svg.replace("<svg", "<svg fill='currentColor' role='img' focusable='false'");

/* Tamaño */
const SIZE = 48;

export default function BrandsMarquee({ size = SIZE, speed = 28 }) {
  /* Cache */
  const items = useMemo(() => {
    const base = ICON_KEYS.map((key) => {
      const icon = icons[key];
      if (!icon) return null;
      const slug = icon.title
        .toLowerCase()
        .replace(/\+/g, "plus")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return {
        key,
        title: icon.title,
        color: icon.hex ? `#${icon.hex}` : "#77e05a",
        svg: asCurrentColor(icon.svg),
        slug,
      };
    }).filter(Boolean);
    return [...base, ...base];
  }, []);

  const navigate = useNavigate();

  /* Click */
  const go = useCallback(
    (slug) => navigate(`/?brand=${encodeURIComponent(slug)}`),
    [navigate]
  );

  /* Teclado */
  const onKey = (e, slug) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go(slug);
    }
  };

  return (
    <div className="brands-wrap" style={{ "--marquee-speed": `${speed}s` }}>
      <div className="brands-mask">
        <div className="brands-track">
          {items.map(({ key, title, color, svg, slug }, i) => (
            <span
              key={`${key}-${i}`}
              className="brand-icon"
              title={title}
              tabIndex={0}
              role="button"
              aria-label={`Ver productos de ${title}`}
              onClick={() => go(slug)}
              onKeyDown={(e) => onKey(e, slug)}
              style={{
                color,
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
