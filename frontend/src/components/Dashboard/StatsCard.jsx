export default function StatsCard({ label, value, subtext, colorClass = "text-slate-900" }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className={`text-4xl font-black ${colorClass}`}>
          {value}
        </p>
      </div>
      <p className="text-slate-500 text-xs mt-4 font-medium italic">
        {subtext}
      </p>
    </div>
  );
}