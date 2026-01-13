import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs } from "../features/gigs/gigSlice";
import GigCard from "../components/GigCard";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Gigs() {
  const dispatch = useDispatch();
  const gigs = useSelector((state) => state.gigs.list);
  const auth = useAuth();
  const [search, setSearch] = useState("");

  const searchLabel = useMemo(() => (search.trim() ? `Results for "${search.trim()}"` : "Browse gigs"), [search]);

  useEffect(() => {
    dispatch(fetchGigs(""));
  }, [dispatch]);

  const onSearch = async (e) => {
    e.preventDefault();
    await dispatch(fetchGigs(search.trim()));
  };

  return (
    <div className="container-app py-8">
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-primary-700">GigFlow Marketplace</p>
            <h1 className="page-title mt-1">Find work. Post gigs. Hire fast.</h1>
            <p className="muted mt-2 max-w-2xl">
              Browse open gigs, place bids with a message + price, and hire the best freelancer in one click.
            </p>
          </div>
          <div className="flex gap-2">
            {auth.isAuth ? (
              <Link to="/dashboard" className="btn-primary">
                Post a gig
              </Link>
            ) : (
              <Link to="/login" className="btn-primary">
                Login to start
              </Link>
            )}
            <Link to="/register" className="btn-outline">
              Create account
            </Link>
          </div>
        </div>

        <form onSubmit={onSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            className="input"
            placeholder="Search gigs by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-accent sm:w-40" type="submit">
            Search
          </button>
        </form>
      </section>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold">{searchLabel}</h2>
        <button className="btn-ghost" onClick={() => { setSearch(""); dispatch(fetchGigs("")); }}>
          Clear
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {gigs.map((gig) => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>

      {gigs.length === 0 ? (
        <div className="mt-6 card p-6">
          <p className="muted">No gigs found. Try another search.</p>
        </div>
      ) : null}
    </div>
  );
}
