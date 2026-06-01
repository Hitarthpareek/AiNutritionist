import {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export async function resetAccount(uid) {
  const q = query(
    collection(db, "meals"),
    where("userId", "==", uid)
  );

  const snapshot = await getDocs(q);

  const promises = snapshot.docs.map((doc) =>
    deleteDoc(doc.ref)
  );

  await Promise.all(promises);
}