import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getGoals(userId) {
  const snapshot = await getDoc(
    doc(db, "goals", userId)
  );

  return snapshot.exists()
    ? snapshot.data()
    : null;
}