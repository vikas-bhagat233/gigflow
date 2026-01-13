import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/time";

export default function GigCard({ gig }) {
  const ownerName = gig?.ownerId?.name;
  const posted = formatRelativeTime(gig?.createdAt);

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg leading-snug">{gig.title}</h3>
        <span className={gig.status === "assigned" ? "pill-assigned" : "pill-open"}>
          {gig.status}
        </span>
      </div>

      <p className="mt-2 text-sm muted">{gig.description}</p>

      {ownerName ? (
        <p className="mt-3 text-xs text-slate-500">
          Posted by <span className="font-semibold text-slate-700">{ownerName}</span>
          {posted ? <span className="text-slate-400"> • {posted}</span> : null}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Budget</p>
          <p className="text-lg font-extrabold">₹{gig.budget}</p>
        </div>
        <Link to={`/gigs/${gig._id}`} className="btn-primary">
          View
        </Link>
      </div>
    </div>
  );
}
