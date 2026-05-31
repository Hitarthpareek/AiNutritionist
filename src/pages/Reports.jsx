import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useDashboardData from "../hooks/userDashboardData";
import { getGoals } from "../services/goalService";
import Navbar from "../components/Navbar";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function Reports() {
  const { user } = useAuth();

  const meals = useDashboardData(user?.uid);

  const [goals, setGoals] = useState(null);

  useEffect(() => {
    async function loadGoals() {
      if (!user) return;

      const data = await getGoals(user.uid);
      setGoals(data);
    }

    loadGoals();
  }, [user]);

  const reportStats = useMemo(() => {
    if (!meals.length) {
      return {
        totalMeals: 0,
        avgCalories: 0,
        avgProtein: 0,
        avgHealth: 0,
        calorieGoalDays: 0,
        proteinGoalDays: 0,
      };
    }

    const totalMeals = meals.length;

    const avgCalories = Math.round(
      meals.reduce((s, m) => s + (m.calories || 0), 0) /
        meals.length
    );

    const avgProtein = (
      meals.reduce((s, m) => s + (m.protein || 0), 0) /
      meals.length
    ).toFixed(1);

    const avgHealth = Math.round(
      meals.reduce(
        (s, m) => s + (m.healthScore || 0),
        0
      ) / meals.length
    );

    const groupedDays = {};

    meals.forEach((meal) => {
      if (!meal.createdAt) return;

      const date = meal.createdAt.seconds
        ? new Date(meal.createdAt.seconds * 1000)
        : new Date(meal.createdAt);

      const key = date.toDateString();

      if (!groupedDays[key]) {
        groupedDays[key] = {
          calories: 0,
          protein: 0,
        };
      }

      groupedDays[key].calories += meal.calories || 0;
      groupedDays[key].protein += meal.protein || 0;
    });

    let calorieGoalDays = 0;
    let proteinGoalDays = 0;

    Object.values(groupedDays).forEach((day) => {
      if (
        goals &&
        day.calories >= goals.calorieGoal
      ) {
        calorieGoalDays++;
      }

      if (
        goals &&
        day.protein >= goals.proteinGoal
      ) {
        proteinGoalDays++;
      }
    });

    return {
      totalMeals,
      avgCalories,
      avgProtein,
      avgHealth,
      calorieGoalDays,
      proteinGoalDays,
    };
  }, [meals, goals]);

  // reports
  const groupedDays = {};

meals.forEach((meal) => {
  if (!meal.createdAt) return;

  const date = meal.createdAt.seconds
    ? new Date(meal.createdAt.seconds * 1000)
    : new Date(meal.createdAt);

  const key = date.toDateString();

  if (!groupedDays[key]) {
    groupedDays[key] = {
      calories: 0,
      protein: 0,
      health: [],
    };
  }

  groupedDays[key].calories += meal.calories || 0;
  groupedDays[key].protein += meal.protein || 0;
  groupedDays[key].health.push(
    meal.healthScore || 0
  );
});

const trackedDays =
  Object.keys(groupedDays).length;

const calorieConsistency =
  trackedDays > 0
    ? Math.round(
        (reportStats.calorieGoalDays /
          trackedDays) *
          100
      )
    : 0;

const proteinConsistency =
  trackedDays > 0
    ? Math.round(
        (reportStats.proteinGoalDays /
          trackedDays) *
          100
      )
    : 0;

const highestProteinMeal =
  meals.length > 0
    ? meals.reduce((a, b) =>
        a.protein > b.protein ? a : b
      )
    : null;

const highestCalorieMeal =
  meals.length > 0
    ? meals.reduce((a, b) =>
        a.calories > b.calories ? a : b
      )
    : null;

const healthiestMeal =
  meals.length > 0
    ? meals.reduce((a, b) =>
        a.healthScore >
        b.healthScore
          ? a
          : b
      )
    : null;

const dayEntries = Object.entries(
  groupedDays
).map(([date, data]) => ({
  date,
  calories: data.calories,
  protein: data.protein,
  avgHealth:
    data.health.reduce(
      (a, b) => a + b,
      0
    ) / data.health.length,
}));

const bestDay =
  dayEntries.length > 0
    ? dayEntries.reduce((a, b) =>
        a.avgHealth > b.avgHealth
          ? a
          : b
      )
    : null;

const worstDay =
  dayEntries.length > 0
    ? dayEntries.reduce((a, b) =>
        a.avgHealth < b.avgHealth
          ? a
          : b
      )
    : null;

function getInsights() {
  const insights = [];

  if (
    proteinConsistency < 70
  ) {
    insights.push(
      "Protein goal is being missed frequently. Consider adding eggs, paneer, milk or chicken."
    );
  }

  if (
    calorieConsistency > 80
  ) {
    insights.push(
      "Excellent calorie consistency across tracked days."
    );
  }

  if (
    reportStats.avgHealth < 60
  ) {
    insights.push(
      "Average health score is low. Add more fruits and vegetables."
    );
  }

  if (
    reportStats.avgProtein > 100
  ) {
    insights.push(
      "Your protein intake is strong."
    );
  }

  return insights;
}

const insights = getInsights();

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "AI Nutrition Dashboard Report",
      14,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `User: ${user?.email || ""}`,
      14,
      35
    );

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      42
    );

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: [
        [
          "Total Meals",
          reportStats.totalMeals,
        ],
        [
          "Average Calories",
          reportStats.avgCalories,
        ],
        [
          "Average Protein",
          reportStats.avgProtein,
        ],
        [
          "Average Health Score",
          reportStats.avgHealth,
        ],
        [
          "Calorie Goal Days",
          reportStats.calorieGoalDays,
        ],
        [
          "Protein Goal Days",
          reportStats.proteinGoalDays,
        ],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [
        [
          "Meal",
          "Calories",
          "Protein",
          "Health Score",
        ],
      ],
      body: meals.slice(0, 15).map((meal) => [
        meal.description,
        meal.calories,
        meal.protein,
        meal.healthScore,
      ]),
    });

    doc.save("nutrition-report.pdf");
  };

  return (
    <div>
        <Navbar/>
    <div className="p-14 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Reports
          </h1>

          <p className="text-gray-500 mt-1">
            Nutrition insights and exports
          </p>
        </div>

        <button
          onClick={downloadReport}
          className="bg-green-600 text-white px-5 py-3 rounded-lg"
        >
          Download PDF Report
        </button>
      </div>

      {/* Summary */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  <div className="bg-white rounded-xl p-6 shadow">
    <h2 className="text-xl font-semibold mb-4">
      Goal Consistency
    </h2>

    <div className="space-y-5">

      <div>
        <p className="font-medium">
          Calorie Goal Achievement
        </p>

        <div className="w-full h-3 bg-gray-200 rounded-full mt-2">
          <div
            className="h-3 bg-green-500 rounded-full"
            style={{
              width: `${calorieConsistency}%`,
            }}
          />
        </div>

        <p className="mt-2 text-gray-600">
          {reportStats.calorieGoalDays}
          /
          {trackedDays}
          {" "}days ({calorieConsistency}%)
        </p>
      </div>

      <div>
        <p className="font-medium">
          Protein Goal Achievement
        </p>

        <div className="w-full h-3 bg-gray-200 rounded-full mt-2">
          <div
            className="h-3 bg-blue-500 rounded-full"
            style={{
              width: `${proteinConsistency}%`,
            }}
          />
        </div>

        <p className="mt-2 text-gray-600">
          {reportStats.proteinGoalDays}
          /
          {trackedDays}
          {" "}days ({proteinConsistency}%)
        </p>
      </div>

    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow">
    <h2 className="text-xl font-semibold mb-4">
      Personal Records
    </h2>

    <div className="space-y-4">

      <div>
        🏆 Highest Protein Meal
        <div className="font-semibold">
          {highestProteinMeal?.description}
        </div>
        <div className="text-gray-500">
          {highestProteinMeal?.protein}g
          protein
        </div>
      </div>

      <div>
        🍕 Highest Calorie Meal
        <div className="font-semibold">
          {highestCalorieMeal?.description}
        </div>
        <div className="text-gray-500">
          {highestCalorieMeal?.calories}
          calories
        </div>
      </div>

      <div>
        🌱 Healthiest Meal
        <div className="font-semibold">
          {healthiestMeal?.description}
        </div>
        <div className="text-gray-500">
          Score:
          {" "}
          {healthiestMeal?.healthScore}
        </div>
      </div>

    </div>
  </div>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

  <div className="bg-white rounded-xl p-6 shadow">
    <h2 className="text-xl font-semibold mb-4">
      Best & Worst Day
    </h2>

    <div className="space-y-6">

      <div>
        ⭐ Best Day
        <div className="font-semibold">
          {bestDay?.date}
        </div>

        <div className="text-gray-500">
          Health Score:
          {" "}
          {Math.round(
            bestDay?.avgHealth || 0
          )}
        </div>
      </div>

      <div>
        ⚠️ Lowest Health Day
        <div className="font-semibold">
          {worstDay?.date}
        </div>

        <div className="text-gray-500">
          Health Score:
          {" "}
          {Math.round(
            worstDay?.avgHealth || 0
          )}
        </div>
      </div>

    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow">
    <h2 className="text-xl font-semibold mb-4">
      AI Nutrition Insights
    </h2>

    <ul className="space-y-3">
      {insights.map(
        (insight, index) => (
          <li
            key={index}
            className="border-l-4 border-green-500 pl-3"
          >
            {insight}
          </li>
        )
      )}
    </ul>
  </div>

</div>

    </div>

    </div>
  );
}
