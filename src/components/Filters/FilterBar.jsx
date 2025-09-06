import React from "react";
import { useSearchParams } from "react-router-dom";

/** Util */
function useDebouncedCallback(fn, delay = 400) {
  const t = React.useRef();
  return React.useCallback((...args) => {
    clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

/** Normaliza string para URL */
const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function FilterBar({ items = [], categories = [] }) {
  const [sp, setSp] = useSearchParams();

  // ——— Datos derivados para opciones ———
  const brands = React.useMemo(() => {
    const set = new Set(items.map(i => (i.brand || "").trim()).filter(Boolean));
    return [...set].sort((a,b)=>a.localeCompare(b));
  }, [items]);

  const priceMin = React.useMemo(() => Math.min(...items.map(i => Number(i.price) || 0), 0), [items]);
  const priceMax = React.useMemo(() => Math.max(...items.map(i => Number(i.price) || 0), 0), [items]);

  // ——— Estado controlado por URL ———
  const q = sp.get("q") || "";
  const cat = sp.get("cat") || "";
  const selectedBrands = (sp.get("b") || "").split(",").filter(Boolean);
  const min = Number(sp.get("min") ?? priceMin);
  const max = Number(sp.get("max") ?? priceMax);
  const inStock = sp.get("stock") === "1";
  const sort = sp.get("sort") || "relevant";

 
  const patch = React.useCallback((obj) => {
    const next = new URLSearchParams(sp);
    Object.entries(obj).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
        next.delete(k);
      } else {
        next.set(k, Array.isArray(v) ? v.join(",") : String(v));
      }
    });
    // reset de paginación 
    next.delete("page");
    setSp(next, { replace: true });
  }, [sp, setSp]);

  const debouncedQ = useDebouncedCallback((value) => patch({ q: value }));

  // ——— Handlers ———
  const toggleBrand = (b) => {
    const set = new Set(selectedBrands);
    set.has(b) ? set.delete(b) : set.add(b);
    patch({ b: [...set] });
  };

  const clearAll = () => {
    const keep = new URLSearchParams(sp);
  
    keep.delete("q"); keep.delete("b"); keep.delete("min"); keep.delete("max");
    keep.delete("stock"); keep.delete("sort");
    setSp(keep, { replace: true });
  };

  return (
    <aside className="filters">
      {/* Search */}
      <div className="filters__block">
        <input
          className="input"
          type="search"
          placeholder="Buscar productos… (Ctrl+K)"
          defaultValue={q}
          onChange={(e) => debouncedQ(e.target.value)}
          aria-label="Buscar productos"
        />
      </div>

      {/* Categoría */}
      <div className="filters__block">
        <label className="label">Categoría</label>
        <select
          className="select"
          value={cat}
          onChange={(e) => patch({ cat: slug(e.target.value) })}
        >
          <option value="">Todas</option>
          {categories.map(c => (
            <option key={c.slug || slug(c.label)} value={c.slug || slug(c.label)}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Marcas */}
      <div className="filters__block">
        <label className="label">Marcas</label>
        <div className="chips">
          {brands.length === 0 && <small className="muted">—</small>}
          {brands.map((b) => {
            const active = selectedBrands.includes(b);
            return (
              <button
                key={b}
                type="button"
                className={`chip ${active ? "chip--active" : ""}`}
                onClick={() => toggleBrand(b)}
                aria-pressed={active}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Precio */}
      <div className="filters__block filters__price">
        <label className="label">Precio</label>
        <div className="price-range">
          <input
            type="number"
            className="input input--sm"
            min={priceMin}
            max={priceMax}
            value={Number.isFinite(min) ? min : priceMin}
            onChange={(e) => patch({ min: e.target.value })}
            aria-label="Precio mínimo"
          />
          <span className="dash">—</span>
          <input
            type="number"
            className="input input--sm"
            min={priceMin}
            max={priceMax}
            value={Number.isFinite(max) ? max : priceMax}
            onChange={(e) => patch({ max: e.target.value })}
            aria-label="Precio máximo"
          />
        </div>
      </div>

      {/* Stock + Orden */}
      <div className="filters__block row">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => patch({ stock: e.target.checked ? "1" : null })}
          />
          <span>En stock</span>
        </label>

        <div className="grow"></div>

        <select
          className="select"
          value={sort}
          onChange={(e) => patch({ sort: e.target.value })}
          aria-label="Ordenar por"
        >
          <option value="relevant">Relevancia</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="title_asc">Nombre A→Z</option>
          <option value="title_desc">Nombre Z→A</option>
          <option value="stock_desc">Stock: mayor primero</option>
        </select>

        <button className="btn-clear" type="button" onClick={clearAll}>
          Limpiar
        </button>
      </div>
    </aside>
  );
}
