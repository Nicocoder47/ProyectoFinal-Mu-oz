// utils/money.js
export const toNumberARS = (v) => {
  if (typeof v === "number") return v;
  if (!v) return 0;
  // borra espacios y símbolos, saca separadores de miles y cambia coma por punto
  const clean = String(v)
    .replace(/[^\d.,-]/g, "")  // deja dígitos, . , -
    .replace(/\./g, "")        // quita puntos (miles)
    .replace(",", ".");        // coma decimal -> punto
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
};

export const formatARS = (n=0) =>
  Number(n).toLocaleString("es-AR", { style:"currency", currency:"ARS" });
