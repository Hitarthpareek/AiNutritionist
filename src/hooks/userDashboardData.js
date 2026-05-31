import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export default function useDashboardData(userId) {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "meals"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMeals(data);
    });

    return () => unsubscribe();
  }, [userId]);

  return meals;
}