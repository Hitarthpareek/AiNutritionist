import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
    toast.success("successfully logged out");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-100 transition md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <h1 className="font-bold text-green-600 text-lg md:text-xl">
          AI Nutrition
        </h1>
      </div>

      {/* CENTER - DESKTOP NAVIGATION (IMPORTANT FIX) */}
      <nav className="hidden md:flex items-center gap-2">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          History
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          Reports
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md border p-4 space-y-2 md:hidden">

          <NavLink onClick={() => setOpen(false)} to="/" className="block p-2 hover:bg-gray-100 rounded">
            Dashboard
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/history" className="block p-2 hover:bg-gray-100 rounded">
            History
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/reports" className="block p-2 hover:bg-gray-100 rounded">
            Reports
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/profile" className="block p-2 hover:bg-gray-100 rounded">
            Profile
          </NavLink>

        </div>
      )}
    </header>
  );
}