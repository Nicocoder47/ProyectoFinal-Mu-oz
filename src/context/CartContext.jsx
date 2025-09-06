import React, { createContext, useContext, useReducer, useMemo, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "gs:cart:v2";

// utils
const toNumber = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (v == null) return 0;
  const clean = String(v).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
};
const clamp = (x, min = 1, max = 9999) => Math.max(min, Math.min(max, x));
const normalize = (p) => ({
  id: p.id,
  title: p.title ?? p.nombre ?? "",
  brand: p.brand ?? "",
  price: toNumber(p.price ?? p.precio),
  image: p.image ?? p.imageUrl ?? "",
  stock: Number.isFinite(p.stock) ? p.stock : 9999,
});
const computeTotals = (items) => ({
  totalQty: items.reduce((acc, it) => acc + (Number(it.qty) || 0), 0),
  total: items.reduce((acc, it) => acc + toNumber(it.price) * (Number(it.qty) || 0), 0),
});

// reducer
function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { item, qty } = action.payload;
      const base = normalize(item);
      const addQty = clamp(Number(qty) || 1, 1, base.stock);
      const idx = state.items.findIndex((i) => i.id === base.id);
      let items;
      if (idx >= 0) {
        const curr = state.items[idx];
        const nextQty = clamp(curr.qty + addQty, 1, base.stock);
        items = state.items.map((i, k) => (k === idx ? { ...i, qty: nextQty } : i));
      } else {
        items = [...state.items, { ...base, qty: addQty }];
      }
      return { items, ...computeTotals(items) };
    }
    case "SET_QTY": {
      const { id, qty } = action.payload;
      const curr = state.items.find((i) => i.id === id);
      if (!curr) return state;
      const nextQty = clamp(Number(qty) || 1, 1, curr.stock);
      const items =
        nextQty <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, qty: nextQty } : i));
      return { items, ...computeTotals(items) };
    }
    case "INC": {
      const { id, step = 1 } = action.payload;
      const curr = state.items.find((i) => i.id === id);
      if (!curr) return state;
      const items = state.items.map((i) =>
        i.id === id ? { ...i, qty: clamp(i.qty + step, 1, i.stock) } : i
      );
      return { items, ...computeTotals(items) };
    }
    case "DEC": {
      const { id, step = 1 } = action.payload;
      const curr = state.items.find((i) => i.id === id);
      if (!curr) return state;
      const next = clamp(curr.qty - step, 0, curr.stock);
      const items =
        next <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, qty: next } : i));
      return { items, ...computeTotals(items) };
    }
    case "REMOVE": {
      const items = state.items.filter((i) => i.id !== action.payload.id);
      return { items, ...computeTotals(items) };
    }
    case "CLEAR":
      return { items: [], totalQty: 0, total: 0 };
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

// init
const empty = { items: [], totalQty: 0, total: 0 };
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return empty;
    const items = parsed.items
      .filter((i) => i && i.id)
      .map((i) => ({
        ...i,
        price: toNumber(i.price),
        qty: clamp(Number(i.qty) || 1, 1, Number(i.stock) || 9999),
        stock: Number(i.stock) || 9999,
      }));
    return { items, ...computeTotals(items) };
  } catch {
    return empty;
  }
};

// provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  const api = useMemo(
    () => ({
      items: state.items,
      totalQty: state.totalQty,
      total: state.total,
      add: (item, qty = 1) => dispatch({ type: "ADD", payload: { item, qty } }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } }),
      inc: (id, step = 1) => dispatch({ type: "INC", payload: { id, step } }),
      dec: (id, step = 1) => dispatch({ type: "DEC", payload: { id, step } }),
      remove: (id) => dispatch({ type: "REMOVE", payload: { id } }),
      clear: () => dispatch({ type: "CLEAR" }),
      utils: { toNumber, clamp },
    }),
    [state]
  );
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

// hook
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
