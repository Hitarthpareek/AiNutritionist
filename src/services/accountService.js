import {
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function resetAccount(uid) {
  const snapshot = await getDocs(
    collection(db, "users", uid, "meals")
  );

  const promises = snapshot.docs.map((doc) =>
    deleteDoc(doc.ref)
  );

  await Promise.all(promises);
}