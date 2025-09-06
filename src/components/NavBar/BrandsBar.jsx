// src/components/NavBar/BrandsMarquee.jsx
import React from "react";
import * as icons from "simple-icons";
import "./BrandsMarquee.css";

const BRANDS = [
  "Logitech",
  "Razer",
  "Nvidia",
  "Amd",
  "Intel",
  "Msi",
  "Asus",
  "Gigabyte",
  "Corsair",
  "Steelseries",
  "Playstation",
  "Xbox",
  "Nintendo",
  "Hyperx",
  "Alienware",
];

export default function BrandsMarquee() {
  const items = [...BRANDS, ...BRANDS]; // duplicamos para efecto marquee

  return (
    <div className="brands-wrap" aria-label="Marcas destacadas">
      <div className="brands-track">
        {items.map((name, i) => {
          const key = "si" + name; 
          const icon = icons[key];
          if (!icon) return null;

          return (
            <div
              key={`${name}-${i}`}
              className="brand-icon"
              title={icon.title}
              dangerouslySetInnerHTML={{ __html: icon.svg }}
              style={{ width: 34, height: 34 }}
            />
          );
        })}
      </div>
    </div>
  );
}
