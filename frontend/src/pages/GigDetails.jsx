import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBids } from "../features/bids/bidSlice";
import BidCard from "../components/BidCard";
import api from "../services/api";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { formatRelativeTime } from "../utils/time";

export default function GigDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const bids = useSelector((state) => state.bids.list);
  const auth = useAuth();

  const [gig, setGig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidError, setBidError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await api.get(`/gigs/${id}`);
        if (isMounted) setGig(res.data);
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || "Could not load gig");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!auth.isAuth) return;
    dispatch(fetchBids(id));
  }, [auth.isAuth, dispatch, id]);

  const refresh = () => dispatch(fetchBids(id));

  const isOwner = useMemo(() => {
    const ownerId = gig?.ownerId?._id ?? gig?.ownerId;
    if (!ownerId || !auth.userId) return false;
    return String(ownerId) === String(auth.userId);
  }, [gig?.ownerId, auth.userId]);

  const canBid = !!gig && gig.status === "open" && auth.isAuth && !isOwner;

  const submitBid = async (e) => {
    e.preventDefault();
    if (!auth.isAuth) return;
    setBidError("");
    setIsSubmitting(true);
    const form = e.target;
    try {
      await api.post("/bids", {
        gigId: id,
        message: form.message.value,
        price: Number(form.price.value)
      });
      form.reset();
      refresh();
    } catch (err) {
      setBidError(err?.response?.data?.message || "Could not submit bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container-app py-10">
        <div className="card p-6">
          <p className="text-red-600 font-semibold">{error}</p>
          <Link className="link mt-3 inline-block" to="/">
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-700">Gig details</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">{gig?.title}</h1>
            <p className="muted mt-2">{gig?.description}</p>
            {gig?.ownerId?.name ? (
              <p className="text-sm text-slate-600 mt-3">
                Posted by <span className="font-semibold text-slate-800">{gig.ownerId.name}</span>
                {gig?.createdAt ? (
                  <span className="text-slate-400"> • {formatRelativeTime(gig.createdAt)}</span>
                ) : null}
              </p>
            ) : null}
          </div>
          <div className="text-left sm:text-right">
            <span className={gig?.status === "assigned" ? "pill-assigned" : "pill-open"}>{gig?.status}</span>
            <p className="mt-3 text-xs text-slate-500">Budget</p>
            <p className="text-2xl font-extrabold">₹{gig?.budget}</p>
          </div>
        </div>

        {!auth.isAuth ? (
          <div className="mt-6 card p-5 bg-white">
            <p className="font-semibold">Want to bid or view bids?</p>
            <p className="muted mt-1">Login to submit a bid, or if you’re the owner, to hire a freelancer.</p>
            <div className="mt-4 flex gap-2">
              <Link className="btn-primary" to="/login">Login</Link>
              <Link className="btn-outline" to="/register">Create account</Link>
            </div>
          </div>
        ) : null}

        {gig?.status !== "open" ? (
          <div className="mt-6 card p-5 bg-white">
            <p className="font-semibold">This gig is already assigned.</p>
            <p className="muted mt-1">Bidding is closed.</p>
          </div>
        ) : null}

        {canBid ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold">Place a bid</h2>
            <p className="muted text-sm mt-1">Send a short message and your best price.</p>

            {bidError ? <p className="text-sm text-red-600 mt-3">{bidError}</p> : null}

            <form onSubmit={submitBid} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input sm:col-span-2" name="message" placeholder="Message" required />
              <input className="input" name="price" placeholder="Price" inputMode="numeric" required />
              <button disabled={isSubmitting} className="btn-accent">
                {isSubmitting ? "Submitting…" : "Submit bid"}
              </button>
            </form>
          </div>
        ) : null}

        {auth.isAuth ? (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Bids</h2>
              {isOwner ? <span className="pill bg-primary-50 text-primary-700 border border-primary-100">You own this gig</span> : null}
            </div>

            <div className="mt-4 grid gap-3">
              {bids.map((bid) => (
                <BidCard key={bid._id} bid={bid} isOwner={isOwner} refresh={refresh} />
              ))}
              {bids.length === 0 ? (
                <div className="card p-5 bg-white">
                  <p className="muted">No bids yet.</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
