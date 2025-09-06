// src/App.jsx
import React, { useEffect, lazy, Suspense, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";

// Loader simple y accesible.
function Loader({ label = "Cargando…" }) {
  return (
    <div role="status" aria-live="polite" style={{ padding: "2rem", textAlign: "center" }}>
      <div style={{
        width: 28, height: 28, margin: "0 auto 8px",
        borderRadius: "50%", border: "3px solid #2a3344", borderTopColor: "var(--accent)",
        animation: "spin 1s linear infinite"
      }}/>
      <small style={{ opacity: .8 }}>{label}</small>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// Scroll al tope en cada navegación.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [pathname]);
  return null;
}

// Enfoque del contenido principal para accesibilidad.
function RouteFocus() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { ref.current?.focus?.(); }, [pathname]);
  return <div ref={ref} tabIndex={-1} aria-hidden="true" />;
}

// Carga diferida de páginas.
const NavBar = lazy(() => import("./components/NavBar/NavBar.jsx"));
const ItemListContainer = lazy(() => import("./components/ItemListContainer/ItemListContainer.jsx"));
const ItemDetailContainer = lazy(() => import("./components/ItemDetailContainer/ItemDetailContainer.jsx"));
const Cart = lazy(() => import("./components/Cart/Cart.jsx"));
const CheckoutForm = lazy(() => import("./components/Checkout/CheckoutForm.jsx"));
const NotFound = lazy(() => import("./components/UI/NotFound.jsx"));

// Aplicación principal.
export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loader label="Cargando navegación…" />}>
          <NavBar />
        </Suspense>

        <main id="main" className="container" style={{ paddingTop: "2rem" }} role="main" aria-live="polite">
          <RouteFocus />
          <Suspense fallback={<Loader label="Cargando contenido…" />}>
            <Routes>
              {/* Home del catálogo. */}
              <Route path="/" element={<ItemListContainer greeting="Bienvenido a Gaming Shop" />} />
              {/* Listado por categoría. */}
              <Route path="/category/:categoryId" element={<ItemListContainer />} />
              {/* Detalle de producto. */}
              <Route path="/item/:id" element={<ItemDetailContainer />} />
              {/* Carrito de compras. */}
              <Route path="/cart" element={<Cart />} />
              {/* Flujo de checkout. */}
              <Route path="/checkout" element={<CheckoutForm />} />
              {/* Redirección a inicio. */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              {/* Página no encontrada. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}
