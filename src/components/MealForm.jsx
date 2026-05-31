import { useState } from "react";
import { analyzeMeal } from "../services/aiService";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function MealForm() {
  const [meal, setMeal] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!meal.trim()) return;

    try {
      setLoading(true);

      const result = await analyzeMeal(meal);

      await addDoc(collection(db, "meals"), {
        userId: user.uid,
        description: meal,
        ...result,
        createdAt: serverTimestamp(),
      });
      setMeal("");
      alert("Meal analyzed successfully");
      

    } catch (error) {
      console.error(error);
      alert("Something went wrong");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold mb-2">
        Analyze Your Meal
      </h3>

      <p className="text-gray-500 mb-4">
        Describe what you ate and get AI-powered nutrition insights.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          placeholder="Example: 2 chapati, dal, rice, salad"
          className="w-full h-36 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          disabled={loading}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          {loading ? "Analyzing..." : "Analyze Meal"}
        </button>
      </form>
    </div>
  );
}