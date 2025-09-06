import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// 🎨 estilos globales 
import "./style/gs.scss";

// 🚀App en el div#root
const root = document.getElementById("root");
if (!root) throw new Error("No se encontró #root en index.html");

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
