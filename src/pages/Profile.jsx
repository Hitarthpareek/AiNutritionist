// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import useDashboardData from "../hooks/userDashboardData";
import { resetAccount } from "../services/accountService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  const meals = useDashboardData(user?.uid);

  useEffect(() => {
  async function fetchUserProfile() {
    if (!user?.uid) return;

    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }

  fetchUserProfile();
}, [user]);

  const stats = useMemo(() => {
    if (!meals.length) {
      return {
        highestProteinMeal: null,
        highestCalorieMeal: null,
        healthiestMeal: null,
        totalMeals: 0,
        daysActive: 0,
        lastAnalysisDate: "-",
      };
    }

    const highestProteinMeal = meals.reduce((a, b) =>
      (a.protein || 0) > (b.protein || 0) ? a : b
    );

    const highestCalorieMeal = meals.reduce((a, b) =>
      (a.calories || 0) > (b.calories || 0) ? a : b
    );

    const healthiestMeal = meals.reduce((a, b) =>
      (a.healthScore || 0) > (b.healthScore || 0)
        ? a
        : b
    );

    const uniqueDays = new Set();

    meals.forEach((meal) => {
      if (!meal.createdAt) return;

      const date = meal.createdAt.seconds
        ? new Date(
            meal.createdAt.seconds * 1000
          )
        : new Date(meal.createdAt);

      uniqueDays.add(date.toDateString());
    });

    const latestMeal = meals[0];

    const lastAnalysisDate =
      latestMeal?.createdAt?.seconds
        ? new Date(
            latestMeal.createdAt.seconds *
              1000
          ).toLocaleDateString()
        : "-";

    return {
      highestProteinMeal,
      highestCalorieMeal,
      healthiestMeal,
      totalMeals: meals.length,
      daysActive: uniqueDays.size,
      lastAnalysisDate,
    };
  }, [meals]);

  const handleResetAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently delete all meal history and analytics data. Continue?"
    );

    if (!confirmed) return;

    try {
      await resetAccount(user.uid);

      alert(
        "Nutrition data deleted successfully."
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to reset account data."
      );
    }
  };

  return (
    <div >
        <Navbar/>
    <div className="bg-gray-100 min-h-screen p-14">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <h1 className="text-3xl font-bold mb-6">
          Profile
        </h1>

        {/* User Card */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-4xl font-bold">
              {user?.displayName
                ? user.displayName
                    .charAt(0)
                    .toUpperCase()
                : user?.email
                    ?.charAt(0)
                    .toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {profile?.name || user?.email?.split("@")[0]}
              </h2>

              <p className="text-gray-500 mt-1">
                {user?.email}
              </p>

              <p className="text-gray-500 mt-1">
                Account Type: Standard User
              </p>
            </div>

          </div>

        </div>

        {/* Nutrition Achievements */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-semibold mb-6">
            Nutrition Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            <AchievementCard
              title="Highest Protein Meal"
              value={
                stats.highestProteinMeal
                  ? `${stats.highestProteinMeal.protein}g`
                  : "-"
              }
              subtitle={
                stats.highestProteinMeal
                  ?.description
              }
            />

            <AchievementCard
              title="Highest Calorie Meal"
              value={
                stats.highestCalorieMeal
                  ?.calories || "-"
              }
              subtitle={
                stats.highestCalorieMeal
                  ?.description
              }
            />

            <AchievementCard
              title="Best Health Score"
              value={
                stats.healthiestMeal
                  ?.healthScore || "-"
              }
              subtitle={
                stats.healthiestMeal
                  ?.description
              }
            />

            <AchievementCard
              title="Meals Analyzed"
              value={stats.totalMeals}
              subtitle="Total analyses"
            />

          </div>

        </div>

        {/* Account Activity */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-semibold mb-6">
            Account Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <ActivityCard
              title="Days Active"
              value={stats.daysActive}
            />

            <ActivityCard
              title="Last Analysis"
              value={
                stats.lastAnalysisDate
              }
            />

            <ActivityCard
              title="Total Meals"
              value={stats.totalMeals}
            />

          </div>

        </div>

        {/* Danger Zone */}

        <div className="bg-white rounded-xl shadow border border-red-200 p-6 mb-6">

          <h2 className="text-xl font-semibold text-red-600 mb-3">
            Danger Zone
          </h2>

          <p className="text-gray-600 mb-6">
            This action permanently deletes
            all nutrition history, meal
            analyses and reports. This
            cannot be undone.
          </p>

          <button
            onClick={handleResetAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Reset Nutrition Data
          </button>

        </div>

        {/* Logout */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Session
          </h2>

          <button
            onClick={logout}
            className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>
    </div>

    </div>
  );
}

function AchievementCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="border rounded-xl p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>

      <p className="text-sm text-gray-500 mt-2 truncate">
        {subtitle}
      </p>
    </div>
  );
}

function ActivityCard({
  title,
  value,
}) {
  return (
    <div className="border rounded-xl p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}