import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await dispatch(login(form)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-app py-10">
      <div className="max-w-md mx-auto card p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Welcome back</h2>
          <p className="muted mt-1">Login to post gigs, bid, and hire.</p>
        </div>

        {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}

        <form onSubmit={submit}>
          <label className="text-sm font-semibold">Email</label>
          <input
            className="input mt-1 mb-4"
            placeholder="you@example.com"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label className="text-sm font-semibold">Password</label>
          <input
            className="input mt-1 mb-5"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="text-sm muted mt-4">
          New here? <Link className="link" to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
