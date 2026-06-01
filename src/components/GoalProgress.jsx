import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function ProgressBar({ label, current, goal, unit = "" }) {
  const percentage = goal
    ? Math.min(Math.round((current / goal) * 100), 100)
    : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-medium text-white">{label}</span>

        <span className="text-sm text-white">
          {current}
          {unit} / {goal}
          {unit}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 bg-green-500 rounded-full transition-all "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-1 text-white">
        {percentage}% completed
      </p>
    </div>
  );
}

export default function GoalProgress({
  calories = 0,
  protein = 0,
  goals,
  onGoalUpdate,
}) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  

  const [calorieGoal, setCalorieGoal] = useState(
    goals?.calorieGoal || 2200
  );

  const [proteinGoal, setProteinGoal] = useState(
    goals?.proteinGoal || 120
  );

  if (!goals) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        Loading goals...
      </div>
    );
  }

  const saveGoals = async () => {
    try {
      await updateDoc(
        doc(db, "goals", user.uid),
        {
          calorieGoal: Number(calorieGoal),
          proteinGoal: Number(proteinGoal),
        }
      );

      const updatedGoals = {
        calorieGoal: Number(calorieGoal),
        proteinGoal: Number(proteinGoal),
      };

      onGoalUpdate(updatedGoals);

      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save goals");
    }
  };

  return (
    <div className="bg-[url('https://static.vecteezy.com/system/resources/thumbnails/072/205/837/small/business-figure-trophy-spotlight-podium-photo.jpeg')] bg-cover bg-center bg-no-repeat mt-8 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          Daily Goals
        </h3>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Edit Goals
          </button>
        ) : (
          <button
            onClick={saveGoals}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save Goals
          </button>
        )}
      </div>

      {editing && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Daily Calorie Goal
            </label>

            <input
              type="number"
              value={calorieGoal}
              onChange={(e) =>
                setCalorieGoal(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Daily Protein Goal (g)
            </label>

            <input
              type="number"
              value={proteinGoal}
              onChange={(e) =>
                setProteinGoal(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>
      )}

      <ProgressBar
        label="Calories"
        current={calories}
        goal={goals.calorieGoal}
      />

      <ProgressBar
        label="Protein"
        current={protein}
        goal={goals.proteinGoal}
        unit="g"
      />
    </div>
  );
}