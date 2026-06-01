import { useState } from "react";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      await setDoc(doc(db, "goals", user.uid), {
        calorieGoal: 2200,
        proteinGoal: 120,
      });

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-emerald-200 px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* LEFT INFO SECTION */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-emerald-600 to-green-500 text-white">
          <h1 className="text-3xl font-bold mb-4">
            Start Your Fitness Journey 🍏
          </h1>

          <p className="text-sm opacity-90 mb-6">
            Create your account and get AI-powered nutrition tracking, calorie
            monitoring, and smart health insights tailored for you.
          </p>

          <ul className="space-y-2 text-sm">
            <li>✔ Personalized nutrition goals</li>
            <li>✔ AI meal analysis</li>
            <li>✔ Daily & weekly tracking</li>
            <li>✔ Smart health recommendations</li>
          </ul>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-8 md:p-10">
          {/* Mobile Logo/Heading */}
          <div className="md:hidden text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              AI Nutrition Tracker 🍏
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Smart AI-powered nutrition analysis
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Create Account
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Join and start tracking your nutrition today
          </p>

          <form onSubmit={registerUser}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition transform hover:scale-[1.02]"
            >
              Create Account
            </button>
          </form>

          {/* LOGIN LINK */}
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-4 text-green-600 font-medium hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
