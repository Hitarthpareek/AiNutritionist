import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Register from "./Register";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const resetPassword = async () => {
  if (!email.trim()) {
    alert("Please enter your email");
    return;
  }

  try {
    setLoading(true);

    await sendPasswordResetEmail(auth, email);

    setMessage(
      "Password reset link has been sent to your email. check spam"
    );
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
    setForgotPassword(false);
  }
};

  const login = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());

      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          createdAt: new Date(),
        });

        await setDoc(doc(db, "goals", user.uid), {
          calorieGoal: 2200,
          proteinGoal: 120,
        });
      }

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-emerald-200 px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* LEFT INFO SECTION */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-green-600 to-emerald-500 text-white">
          <h1 className="text-3xl font-bold mb-4">AI Nutrition Tracker 🍏</h1>

          <p className="text-sm opacity-90 mb-6">
            Track your meals, analyze nutrition using AI, monitor calories,
            protein intake, and achieve your fitness goals effortlessly.
          </p>

          <ul className="space-y-2 text-sm">
            <li>✔ AI-powered meal analysis</li>
            <li>✔ Daily & weekly calorie tracking</li>
            <li>✔ Personalized nutrition goals</li>
            <li>✔ Smart health insights</li>
          </ul>
        </div>

        {/* RIGHT LOGIN SECTION */}
         <div className="p-8 md:p-10">
  <h2 className="text-2xl font-bold mb-2 text-gray-800">
    {forgotPassword ? "Reset Password" : "Welcome Back"}
  </h2>

  <p className="text-sm text-gray-500 mb-6">
    {forgotPassword
      ? "Enter your email and we'll send a reset link."
      : "Login to continue tracking your nutrition journey"}
  </p>

  {message && (
    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
      {message}
    </div>
  )}

  {!forgotPassword ? (
    <>
      <form onSubmit={login}>
        <input
          className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white p-3 rounded-lg transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <button
        onClick={googleLogin}
        disabled={loading}
        className="w-full mt-3 border p-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
      >
        {loading ? "Please wait..." : "Continue with Google"}
      </button>

      <button
        onClick={() => {
          setForgotPassword(true);
          setMessage("");
        }}
        className="w-full mt-4 text-sm text-green-600 hover:underline"
      >
        Forgot Password?
      </button>

      <button
        onClick={() => navigate("/register")}
        className="w-full mt-3 text-green-600 font-medium hover:underline"
      >
        Sign up with Email?
      </button>
    </>
  ) : (
    <>
      <input
        type="email"
        className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={resetPassword}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white p-3 rounded-lg transition"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <button
        onClick={() => {
          setForgotPassword(false);
          setMessage("");
        }}
        className="w-full mt-4 text-green-600 hover:underline"
      >
        Back to Login
      </button>
    </>
  )}
</div>
      </div>
    </div>
  );
}
