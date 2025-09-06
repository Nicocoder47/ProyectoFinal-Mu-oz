// utils/money.js
export const toNumberARS = (v) => {
  if (typeof v === "number") return v;
  if (!v) return 0;
  // borra espacios y símbolos
  const clean = String(v)
    .replace(/[^\d.,-]/g, "") 
    .replace(/\./g, "")        
    .replace(",", ".");       
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
};

export const formatARS = (n=0) =>
  Number(n).toLocaleString("es-AR", { style:"currency", currency:"ARS" });
