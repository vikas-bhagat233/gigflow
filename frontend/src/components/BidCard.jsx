import api from "../services/api";
import { formatRelativeTime } from "../utils/time";
import { useState } from "react";

export default function BidCard({ bid, isOwner, refresh }) {
  const [isHiring, setIsHiring] = useState(false);
  const [error, setError] = useState("");

  const hireHandler = async () => {
    setError("");
    setIsHiring(true);
    try {
      await api.patch(`/bids/${bid._id}/hire`);
      refresh();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not hire freelancer");
    } finally {
      setIsHiring(false);
    }
  };

  const statusClass =
    bid.status === "hired"
      ? "pill bg-emerald-50 text-emerald-700 border border-emerald-200"
      : bid.status === "rejected"
        ? "pill bg-slate-100 text-slate-700 border border-slate-200"
        : "pill bg-amber-50 text-amber-700 border border-amber-200";

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-800">{bid.message}</p>
          {bid?.freelancer?.name ? (
            <p className="text-xs text-slate-500 mt-1">
              Bid by <span className="font-semibold text-slate-700">{bid.freelancer.name}</span>
              {bid?.createdAt ? (
                <span className="text-slate-400"> • {formatRelativeTime(bid.createdAt)}</span>
              ) : null}
            </p>
          ) : null}
        </div>
        <span className={statusClass}>{bid.status}</span>
      </div>

      {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">Proposed</p>
        <p className="text-lg font-extrabold">₹{bid.price}</p>
      </div>

      {isOwner && bid.status === "pending" && (
        <button
          onClick={hireHandler}
          disabled={isHiring}
          className="mt-4 btn-accent w-full"
        >
          {isHiring ? "Hiring…" : "Hire"}
        </button>
      )}
    </div>
  );
}
