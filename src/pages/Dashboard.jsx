import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import MealForm from "../components/MealForm";
import RecentMeals from "../components/RecentMeals";
import MacroChart from "../components/MacroChart";
import WeeklyCaloriesChart from "../components/WeeklyCaloriesChart";
import GoalProgress from "../components/GoalProgress";
import AnalysisResult from "../components/AnalysisResult";
import { useAuth } from "../context/AuthContext";
import useDashboardData from "../hooks/userDashboardData";
import { getGoals } from "../services/goalService";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const meals = useDashboardData(user?.uid);
  const latestMeal = meals[0];
  const [goals, setGoals] = useState(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setBlink(true);

    const timer = setTimeout(() => {
      setBlink(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [meals]);

  const today = new Date();

  const todaysMeals = meals.filter((meal) => {
    if (!meal.createdAt) return false;

    const mealDate = meal.createdAt.seconds
      ? new Date(meal.createdAt.seconds * 1000)
      : new Date(meal.createdAt);

    return (
      mealDate.getDate() === today.getDate() &&
      mealDate.getMonth() === today.getMonth() &&
      mealDate.getFullYear() === today.getFullYear()
    );
  });

  const caloriesConsumed = Math.floor(
    todaysMeals.reduce((sum, meal) => sum + meal.calories, 0),
  );

  const proteinConsumed = Math.floor(
    todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
  );

  const totalCalories = Math.floor(
    todaysMeals.reduce((sum, meal) => sum + meal.calories, 0),
  );
  const totalProtein = Math.floor(
    todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
  );

  const weeklyData = [
    { day: "Mon", calories: 0 },
    { day: "Tue", calories: 0 },
    { day: "Wed", calories: 0 },
    { day: "Thu", calories: 0 },
    { day: "Fri", calories: 0 },
    { day: "Sat", calories: 0 },
    { day: "Sun", calories: 0 },
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  meals.forEach((meal) => {
    if (!meal.createdAt) return;

    const date = meal.createdAt.seconds
      ? new Date(meal.createdAt.seconds * 1000)
      : new Date(meal.createdAt);

    const dayName = days[date.getDay()];

    const dayData = weeklyData.find((d) => d.day === dayName);

    if (dayData) {
      dayData.calories += meal.calories || 0;
    }
  });

  const averageHealthScore =
    todaysMeals.length > 0
      ? Math.round(
          meals.reduce((sum, meal) => sum + meal.healthScore, 0) / meals.length,
        )
      : 0;
  const macroData = [
    {
      name: "Protein",
      value: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
    },
    {
      name: "Carbs",
      value: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    },
    {
      name: "Fat",
      value: todaysMeals.reduce((sum, meal) => sum + meal.fats, 0),
    },
  ];

  useEffect(() => {
    async function loadGoals() {
      if (!user) return;

      const data = await getGoals(user.uid);

      setGoals(data);
    }

    loadGoals();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100">
      <Navbar />

      <div className="flex">
        <main className="flex-1 p-6 md:p-10 lg:p-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 tracking-tight">
            Dashboard Overview
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <StatsCard
              title="Calories Today"
              value={totalCalories}
              subtitle="Tracked Meals"
              background={"https://www.shutterstock.com/image-photo/calorie-calculator-diet-background-healthy-600nw-2564406077.jpg"}
            />

            <StatsCard
              title="Protein"
              value={`${totalProtein}g`}
              subtitle="Total Intake"
              background={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBfWHkGUy_geveG_Vr-v21_-GWbWubFMphaw&s"}
            />

            <StatsCard
              title="Meals Logged"
              value={todaysMeals.length}
              subtitle="Recorded Meals"
              background={"https://img.freepik.com/free-photo/top-view-avocado-toast-with-radish-seeds-plate-with-copy-space_23-2148749089.jpg?semt=ais_hybrid&w=740&q=80"}
            />

            <StatsCard
              title="Health Score"
              value={averageHealthScore}
              subtitle="Average Score"
              background={"https://st3.depositphotos.com/22628872/36666/i/450/depositphotos_366665264-stock-photo-madras-beef-basmati-rice-indian.jpg"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MealForm />
            </div>

            <div
              className={
                blink
                  ? "animate-pulse bg-gradient-to-br from-red-400 to-emerald-500 text-white rounded-2xl shadow-lg border border-green-300 p-6 transition-all duration-300"
                  : "bg-gradient-to-r from-red-400 to-emerald-500 w-full text-white hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-2xl border border-gray-100 p-6"
              }
            >
              <h3 className="text-xl font-semibold mb-4">AI Recommendations</h3>

              {meals.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-center">
                  <p className="text-white-500">
                    Analyze a meal to start receiving AI recommendations.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="text-lg font-semibold mb-4">
                    ({latestMeal?.description})
                  </h4>

                  <ul className="space-y-2">
                    {latestMeal?.recommendations?.map(
                      (recommendation, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span>✓</span>
                          {recommendation}
                        </li>
                      ),
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>

          {meals.length === 0 ? (
            <div></div>
          ) : (
            <AnalysisResult meal={latestMeal} />
          )}

          {meals.length === 0 ? (
            <div></div>
          ) : (
            <RecentMeals meals={meals.slice(0, 5)} />
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
            {meals.length === 0 ? <div></div> : <MacroChart data={macroData} />}
            {meals.length === 0 ? (
              <div></div>
            ) : (
              <WeeklyCaloriesChart data={weeklyData} />
            )}
          </div>

          <div className="mt-1">
            <GoalProgress
              calories={caloriesConsumed}
              protein={proteinConsumed}
              goals={goals}
              onGoalUpdate={setGoals}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
