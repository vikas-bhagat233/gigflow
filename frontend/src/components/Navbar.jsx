import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../features/auth/authSlice";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const onLogout = async () => {
    await dispatch(logoutAsync());
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur">
      <div className="container-app h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-white font-extrabold shadow">
            G
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Gig<span className="text-primary-700">Flow</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className="btn-ghost">
            Browse
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn-outline"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {auth.isAuth ? (
            <>
              <Link to="/dashboard" className="btn-outline">
                Dashboard
              </Link>
              <button onClick={onLogout} className="btn-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
