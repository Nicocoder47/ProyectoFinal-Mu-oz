// src/services/products.js
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export const getAllProducts = async () => {
  const ref = collection(db, "products");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getProductById = async (id) => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
