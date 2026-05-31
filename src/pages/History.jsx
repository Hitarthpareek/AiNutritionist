import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useDashboardData from "../hooks/userDashboardData";
import { getGoals } from "../services/goalService";
import Navbar from "../components/Navbar";

export default function History() {
  const { user } = useAuth();

  const meals = useDashboardData(user?.uid);

  const [goals, setGoals] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedMeal, setSelectedMeal] =
    useState(null);

  useEffect(() => {
    async function loadGoals() {
      if (!user) return;

      const data = await getGoals(user.uid);
      setGoals(data);
    }

    loadGoals();
  }, [user]);

  const stats = useMemo(() => {
    if (!goals) {
      return {
        calorieGoalDays: 0,
        proteinGoalDays: 0,
      };
    }

    const grouped = {};

    meals.forEach((meal) => {
      if (!meal.createdAt) return;

      const date = meal.createdAt.seconds
        ? new Date(
            meal.createdAt.seconds * 1000
          )
        : new Date(meal.createdAt);

      const key = date.toDateString();

      if (!grouped[key]) {
        grouped[key] = {
          calories: 0,
          protein: 0,
        };
      }

      grouped[key].calories +=
        meal.calories || 0;

      grouped[key].protein +=
        meal.protein || 0;
    });

    let calorieGoalDays = 0;
    let proteinGoalDays = 0;

    Object.values(grouped).forEach((day) => {
      if (
        day.calories >= goals.calorieGoal
      ) {
        calorieGoalDays++;
      }

      if (
        day.protein >= goals.proteinGoal
      ) {
        proteinGoalDays++;
      }
    });

    return {
      calorieGoalDays,
      proteinGoalDays,
    };
  }, [meals, goals]);

  const filteredMeals = useMemo(() => {
    let data = [...meals];

    if (search) {
      data = data.filter((meal) =>
        meal.description
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    const now = new Date();

    if (filter === "today") {
      data = data.filter((meal) => {
        const date =
          meal.createdAt.seconds
            ? new Date(
                meal.createdAt.seconds * 1000
              )
            : new Date(meal.createdAt);

        return (
          date.toDateString() ===
          now.toDateString()
        );
      });
    }

    if (filter === "week") {
      data = data.filter((meal) => {
        const date =
          meal.createdAt.seconds
            ? new Date(
                meal.createdAt.seconds * 1000
              )
            : new Date(meal.createdAt);

        const diff =
          (now - date) /
          (1000 * 60 * 60 * 24);

        return diff <= 7;
      });
    }

    if (filter === "month") {
      data = data.filter((meal) => {
        const date =
          meal.createdAt.seconds
            ? new Date(
                meal.createdAt.seconds * 1000
              )
            : new Date(meal.createdAt);

        const diff =
          (now - date) /
          (1000 * 60 * 60 * 24);

        return diff <= 30;
      });
    }

    if (filter === "highProtein") {
      data = data.filter(
        (meal) => meal.protein >= 30
      );
    }

    if (filter === "highCalories") {
      data = data.filter(
        (meal) => meal.calories >= 700
      );
    }

    switch (sortBy) {
      case "oldest":
        data.sort((a, b) => {
          const da =
            a.createdAt?.seconds || 0;
          const db =
            b.createdAt?.seconds || 0;
          return da - db;
        });
        break;

      case "calories":
        data.sort(
          (a, b) =>
            b.calories - a.calories
        );
        break;

      case "protein":
        data.sort(
          (a, b) =>
            b.protein - a.protein
        );
        break;

      case "health":
        data.sort(
          (a, b) =>
            b.healthScore -
            a.healthScore
        );
        break;

      default:
        data.sort((a, b) => {
          const da =
            a.createdAt?.seconds || 0;
          const db =
            b.createdAt?.seconds || 0;
          return db - da;
        });
    }

    return data;
  }, [meals, search, filter, sortBy]);

  const avgCalories =
    meals.length > 0
      ? Math.round(
          meals.reduce(
            (s, m) =>
              s + (m.calories || 0),
            0
          ) / meals.length
        )
      : 0;

  const avgProtein =
    meals.length > 0
      ? (
          meals.reduce(
            (s, m) =>
              s + (m.protein || 0),
            0
          ) / meals.length
        ).toFixed(1)
      : 0;

  const avgHealth =
    meals.length > 0
      ? Math.round(
          meals.reduce(
            (s, m) =>
              s +
              (m.healthScore || 0),
            0
          ) / meals.length
        )
      : 0;

  return (
    <div>
     <Navbar/>
    <div className="p-14 bg-gray-100 min-h-screen">
        
      <h1 className="text-3xl font-bold mb-2">
        Meal History
      </h1>

      <p className="text-gray-500 mb-6">
        Track and review all meal
        analyses.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Meals"
          value={meals.length}
        />

        <StatCard
          title="Avg Calories"
          value={avgCalories}
        />

        <StatCard
          title="Avg Protein"
          value={`${avgProtein}g`}
        />

        <StatCard
          title="Calorie Goal Days"
          value={stats.calorieGoalDays}
        />

        <StatCard
          title="Protein Goal Days"
          value={stats.proteinGoalDays}
        />
      </div>

      {/* Search + Sort */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search meals..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 border p-3 rounded"
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="newest">
              Newest
            </option>
            <option value="oldest">
              Oldest
            </option>
            <option value="calories">
              Highest Calories
            </option>
            <option value="protein">
              Highest Protein
            </option>
            <option value="health">
              Highest Health Score
            </option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ["all", "All"],
          ["today", "Today"],
          ["week", "Last 7 Days"],
          ["month", "Last 30 Days"],
          [
            "highProtein",
            "High Protein",
          ],
          [
            "highCalories",
            "High Calories",
          ],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() =>
              setFilter(key)
            }
            className={`px-4 py-2 rounded-lg ${
              filter === key
                ? "bg-green-600 text-white"
                : "bg-white border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-xl p-5 shadow"
          >
            <h3 className="font-bold text-lg mb-2">
              {meal.description}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {meal.createdAt?.seconds
                ? new Date(
                    meal.createdAt.seconds *
                      1000
                  ).toLocaleDateString()
                : "-"}
            </p>

            <div className="space-y-2">
              <p>
                Calories: {meal.calories}
              </p>
              <p>
                Protein: {meal.protein}g
              </p>
              <p>
                Health Score:{" "}
                {meal.healthScore}
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedMeal(meal)
              }
              className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              Meal Details
            </h2>

            <p className="mb-4">
              {selectedMeal.description}
            </p>

            <div className="space-y-2 mb-4">
              <p>
                Calories:{" "}
                {selectedMeal.calories}
              </p>
              <p>
                Protein:{" "}
                {selectedMeal.protein}g
              </p>
              <p>
                Carbs: {selectedMeal.carbs}g
              </p>
              <p>
                Fat: {selectedMeal.fats}g
              </p>
              <p>
                Health Score:{" "}
                {selectedMeal.healthScore}
              </p>
            </div>

            <h3 className="font-semibold mb-2">
              Recommendations
            </h3>

            <ul className="list-disc ml-5 mb-4">
              {selectedMeal.recommendations?.map(
                (r, i) => (
                  <li key={i}>{r}</li>
                )
              )}
            </ul>

            <button
              onClick={() =>
                setSelectedMeal(null)
              }
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-gray-500 text-sm">
        {title}
      </p>
      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
    
  );
}