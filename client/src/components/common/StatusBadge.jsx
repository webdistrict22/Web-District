const statusStyles = {
  New: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  Read: "border-blue-300/25 bg-blue-300/10 text-blue-200",
  Replied: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  Archived: "border-slate-300/25 bg-slate-300/10 text-slate-200",

  Reviewed: "border-blue-300/25 bg-blue-300/10 text-blue-200",
  Accepted: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  Rejected: "border-red-300/25 bg-red-300/10 text-red-200",
  "In Progress": "border-[#C69A4E]/30 bg-[#C69A4E]/12 text-[#F1D08B]",
  "Contract Sent": "border-purple-300/25 bg-purple-300/10 text-purple-200",
  Completed: "border-green-300/25 bg-green-300/10 text-green-200",

  Pending: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  Cancelled: "border-red-300/25 bg-red-300/10 text-red-200",
  Rescheduled: "border-orange-300/25 bg-orange-300/10 text-orange-200",
  Done: "border-green-300/25 bg-green-300/10 text-green-200",

  Draft: "border-slate-300/25 bg-slate-300/10 text-slate-200",
  Sent: "border-blue-300/25 bg-blue-300/10 text-blue-200",
};

function StatusBadge({ status = "New" }) {
  const style =
    statusStyles[status] || "border-white/10 bg-white/[0.04] text-[#CBD5E1]";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;