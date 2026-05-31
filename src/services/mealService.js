import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

export async function getUserMeals(userId) {
  const q = query(
    collection(db, "meals"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}