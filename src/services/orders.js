// src/services/orders.js
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

/* ---------- Utils ---------- */
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

const normalizeItem = (it) => ({
  id: String(it.id),
  title: String(it.title ?? ""),
  price: toNum(it.price),
  quantity: toNum(it.quantity ?? it.qty ?? 0),
  image: it.image ?? it.imageUrl ?? "",
  brand: it.brand ?? "",
});

const validate = ({ buyer, items }) => {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Carrito vacío");
  if (!buyer) throw new Error("Buyer faltante");
  const name = String(buyer.name || "").trim();
  const email = String(buyer.email || "").trim();
  if (!name) throw new Error("Nombre requerido");
  if (!isEmail(email)) throw new Error("Email inválido");
};

const computeTotal = (items) =>
  items.reduce((a, b) => a + toNum(b.price) * toNum(b.quantity), 0);

const buildOrder = ({ buyer, items, total }) => ({
  buyer: {
    name: String(buyer.name || "").trim(),
    email: String(buyer.email || "").trim(),
    phone: String(buyer.phone || "").trim(),
    address: String(buyer.address || "").trim(),
    notes: String(buyer.notes || "").trim(),
  },
  items: items.map(({ id, title, price, quantity }) => ({ id, title, price, quantity })),
  total,
  status: "pending",
  createdAt: serverTimestamp(),
});

/* ---------- Crear orden (con opción de descontar stock) ---------- */
export async function createOrder({ buyer, items, total, updateStock = false }) {
  validate({ buyer, items });

  const norm = items
    .map(normalizeItem)
    .filter((it) => it.id && it.quantity > 0 && it.price >= 0);

  const serverTotal = computeTotal(norm);
  const diff = Math.abs(serverTotal - toNum(total));
  if (diff > 0.005) throw new Error("Total inválido");

  const ordersCol = collection(db, "orders");
  const orderRef = doc(ordersCol); // id preasignado

  const orderId = await runTransaction(db, async (tx) => {
    // Si no actualizamos stock, solo guardamos la orden
    if (!updateStock) {
      const payload = buildOrder({ buyer, items: norm, total: serverTotal });
      tx.set(orderRef, payload);
      return orderRef.id;
    }

    // 1) Leer todos los productos UNA sola vez
    const productSnaps = await Promise.all(
      norm.map((it) => tx.get(doc(db, "products", it.id)))
    );

    // 2) Verificar stocks
    productSnaps.forEach((snap, i) => {
      if (!snap.exists()) throw new Error(`Producto inexistente: ${norm[i].id}`);
      const stock = toNum(snap.data().stock ?? 0);
      if (stock < norm[i].quantity) {
        const title = snap.data().title || norm[i].id;
        throw new Error(`Sin stock suficiente: ${title}`);
      }
    });

    // 3) Descontar stocks
    productSnaps.forEach((snap, i) => {
      const pRef = doc(db, "products", norm[i].id);
      const stock = toNum(snap.data().stock ?? 0);
      tx.update(pRef, { stock: stock - norm[i].quantity });
    });

    // 4) Guardar la orden
    const payload = buildOrder({ buyer, items: norm, total: serverTotal });
    tx.set(orderRef, payload);

    return orderRef.id;
  });

  return orderId;
}

/* ---------- Obtener orden por ID ---------- */
export async function getOrderById(id) {
  const ref = doc(db, "orders", String(id));
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
