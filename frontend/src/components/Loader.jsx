export default function Loader() {
  return (
    <div className="container-app py-16">
      <div className="card p-8 flex items-center justify-center gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-primary-600 animate-spin" />
        <p className="muted font-semibold">Loading…</p>
      </div>
    </div>
  );
}
