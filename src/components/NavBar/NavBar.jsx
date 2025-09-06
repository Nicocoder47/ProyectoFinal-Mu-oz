// src/components/NavBar/NavBar.jsx
import React from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import CartWidget from "../CartWidget/CartWidget.jsx";
import CartDrawer from "../Cart/CartDrawer.jsx";
import BrandsMarquee from "./BrandsMarquee.jsx";
import { CATEGORIES as FALLBACK } from "../../utils/categories.js";
import { getAllProducts } from "../../services/products.js";

/* Iconos */
const MenuIcon = (p) => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
  </svg>
);
const SearchIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"/>
  </svg>
);

/* Utils */
const slug = (s="") =>
  s.normalize?.("NFD").replace(/[\u0300-\u036f]/g,"")
   .toLowerCase().trim().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
const uniqBy = (arr, key) => {
  const seen = new Set(); const out = [];
  for (const x of arr) { const k = key(x); if (!seen.has(k)) { seen.add(k); out.push(x); } }
  return out;
};

export default function NavBar() {
  /* Estado */
  const [open, setOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [cats, setCats] = React.useState(FALLBACK);
  const firstRef = React.useRef(null);
  const lastRef  = React.useRef(null);
  const searchRef = React.useRef(null);

  /* Router */
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  /* Scroll */
  React.useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle("has-scroll", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Shortcuts */
  React.useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const typing = tag === "input" || tag === "textarea";
      if ((e.key === "/" || (e.ctrlKey && (e.key.toLowerCase() === "k"))) && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Query */
  React.useEffect(() => {
    const sp = new URLSearchParams(search);
    setQ(sp.get("q") || "");
  }, [search]);

  /* Cierre */
  React.useEffect(() => { setOpen(false); }, [pathname]);

  /* Bloqueo */
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [open]);

  /* Categorias */
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const prods = await getAllProducts();
        const raw = prods.map(p => String(p.category ?? p.categoria ?? "").trim()).filter(Boolean);
        if (!alive) return;
        if (raw.length) {
          const mapped = raw.map(v => ({ slug: slug(v), label: v.replace(/\b\w/g, m => m.toUpperCase()) }));
          const unique = uniqBy(mapped, x => x.slug);
          setCats(unique.length ? unique : FALLBACK);
        }
      } catch {
        setCats(FALLBACK);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* Buscar */
  function submitSearch(e) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/?q=${encodeURIComponent(query)}`);
  }

  /* Trap */
  const trapKey = (e) => {
    if (e.key !== "Tab") return;
    const first = firstRef.current, last = lastRef.current;
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* Clase */
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <>
      {/* Barra */}
      <header className="navbar" role="banner" style={{ height: "72px" }}>
        <div className="container navbar-inner" style={{ gap: 14 }}>
          {/* Izquierda */}
          <div className="nav-left" style={{ gap: 12 }}>
            <button className="icon-btn" aria-label="Menú" onClick={() => setOpen(true)}>
              <MenuIcon />
            </button>

            <Link to="/" className="brand" aria-label="Inicio" style={{ fontSize: "1.25rem" }}>
              <span className="accent">Gaming</span>Shop
            </Link>

            <nav className="nav-links" aria-label="Categorías">
              <NavLink to="/" className={linkClass} end>Inicio</NavLink>
              {cats.map((c) => (
                <NavLink key={c.slug} to={`/category/${c.slug}`} className={linkClass}>
                  {c.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Derecha */}
          <div className="nav-right" style={{ gap: 12 }}>
            <form onSubmit={submitSearch} role="search" aria-label="Buscar" className="search" style={{ height: 44, borderRadius: 14 }}>
              <SearchIcon />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar…  ( /  o  Ctrl+K )"
                aria-label="Buscar productos"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                style={{ width: 240 }}
              />
            </form>

            <CartWidget onClick={() => setCartOpen(true)} />
          </div>
        </div>

        <BrandsMarquee />
      </header>

      {/* Drawer */}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      {/* Overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="nav-overlay"
          onKeyDown={trapKey}
          onClick={() => setOpen(false)}
        >
          <div className="container nav-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <button ref={firstRef} className="btn-outline" onClick={() => setOpen(false)}>Cerrar</button>
              <span className="brand" aria-hidden="true"><span className="accent">Gaming</span>Shop</span>
            </div>

            <nav aria-label="Menú móvil" className="sheet-links">
              <NavLink to="/" className={linkClass} end>Inicio</NavLink>
              {cats.map((c) => (
                <NavLink key={c.slug} to={`/category/${c.slug}`} className={linkClass}>
                  {c.label}
                </NavLink>
              ))}
            </nav>

            <form onSubmit={submitSearch} role="search" className="sheet-search">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar productos…"
                aria-label="Buscar productos"
              />
            </form>

            <button ref={lastRef} className="btn-primary" onClick={() => setOpen(false)} style={{ marginTop: ".5rem" }}>
              Listo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
