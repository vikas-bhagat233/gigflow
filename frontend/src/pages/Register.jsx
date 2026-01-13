import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-app py-10">
      <div className="max-w-md mx-auto card p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Create your account</h2>
          <p className="muted mt-1">Start posting gigs and hiring faster.</p>
        </div>

        {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}

        <form onSubmit={submit}>
          <label className="text-sm font-semibold">Name</label>
          <input
            className="input mt-1 mb-4"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

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

          <button disabled={isSubmitting} className="btn-accent w-full">
            {isSubmitting ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="text-sm muted mt-4">
          Already have an account? <Link className="link" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
