import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createGig } from "../features/gigs/gigSlice";
import { useEffect } from "react";
import api from "../services/api";
import socket from "../services/socket";
import { formatRelativeTime } from "../utils/time";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/notifications", { params: { limit: 10 } });
        if (mounted) setNotifications(res.data);
      } catch {
        // ignore
      }
    };

    load();

    const onNotification = (n) => {
      setNotifications((prev) => [n, ...prev].slice(0, 10));
    };
    socket.on("notification", onNotification);

    return () => {
      mounted = false;
      socket.off("notification", onNotification);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await dispatch(
        createGig({
          title: form.title.trim(),
          description: form.description.trim(),
          budget: Number(form.budget)
        })
      ).unwrap();
      setForm({ title: "", description: "", budget: "" });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not post gig");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-app py-8">
      <div className="card p-6 sm:p-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-2 muted">Post gigs, review bids, and hire with one click.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="card p-5 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Notifications</h2>
              <span className="pill bg-slate-100 text-slate-700 border border-slate-200">Latest</span>
            </div>

            <div className="mt-4 grid gap-2">
              {notifications.length === 0 ? (
                <p className="muted">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div>
                      <p className="font-semibold">{n.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {n.createdAt ? formatRelativeTime(n.createdAt) : ""}
                      </p>
                    </div>
                    <span className={n.type === "bid_accepted" ? "pill bg-emerald-50 text-emerald-700 border border-emerald-200" : "pill bg-amber-50 text-amber-700 border border-amber-200"}>
                      {n.type === "bid_accepted" ? "Accepted" : "Rejected"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold">Post a Gig</h2>
            <p className="text-sm muted mt-1">It will appear instantly on the browse page.</p>

            {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}

            <form onSubmit={onSubmit} className="mt-4">
            <input
              className="input mb-3"
              placeholder="Title (e.g., Build a landing page)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              className="textarea mb-3"
              placeholder="Description (requirements, timeline, etc.)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              required
            />
            <input
              className="input mb-4"
              placeholder="Budget (e.g., 5000)"
              inputMode="numeric"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              required
            />

            <button
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Posting..." : "Post Gig"}
            </button>
          </form>

            <p className="text-xs text-slate-500 mt-3">
              Tip: After posting, browse gigs on <Link className="link" to="/">Browse</Link>.
            </p>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold">How it works</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-extrabold border border-primary-100">
                  1
                </div>
                <div>
                  <p className="font-semibold">Post a gig</p>
                  <p className="muted">Use the form here → it appears on the browse list.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center font-extrabold border border-accent-100">
                  2
                </div>
                <div>
                  <p className="font-semibold">Bid on a job</p>
                  <p className="muted">
                    Go to <Link className="link" to="/">Browse</Link>, open a gig, then submit your message + price.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold border border-emerald-200">
                  3
                </div>
                <div>
                  <p className="font-semibold">Hire a freelancer</p>
                  <p className="muted">
                    On your gig details page, click <span className="font-semibold">Hire</span> on the best bid.
                    It becomes <span className="font-semibold">hired</span> and the others become <span className="font-semibold">rejected</span>.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
