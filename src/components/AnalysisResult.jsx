import { useEffect } from "react";

export default function AnalysisResult({meal}) {

  if (!meal) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-10 mt-8 " id="analysisResult">
      <h3 className="text-xl font-semibold mb-4">
        Latest Analysis
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <p className="text-gray-500">Calories</p>
          <p className="font-bold">{meal.calories}</p>
        </div>

        <div>
          <p className="text-gray-500">Protein</p>
          <p className="font-bold">{meal.protein}g</p>
        </div>

        <div>
          <p className="text-gray-500">Carbs</p>
          <p className="font-bold">{meal.carbs}g</p>
        </div>

        <div>
          <p className="text-gray-500">Fats</p>
          <p className="font-bold">{meal.fats}g</p>
        </div>

        <div>
          <p className="text-gray-500">Score</p>
          <p className="font-bold">{meal.healthScore}/100</p>
        </div>
      </div>
    </div>
  );
}