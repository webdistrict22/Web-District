import useLanguage from "../../hooks/useLanguage";

const statusStyles = {
  New: "border-[#C4A77D]/32 bg-[#C4A77D]/14 text-[#F8F7F4]",
  Read: "border-white/10 bg-white/[0.04] text-[#D9D4CC]",
  Replied: "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]",
  Archived: "border-[#D9D4CC]/18 bg-white/[0.025] text-[#D9D4CC]",

  Reviewed: "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]",
  Accepted: "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]",
  Rejected: "border-[#64131A]/35 bg-[#64131A]/18 text-[#F8F7F4]",

  Draft: "border-[#D9D4CC]/18 bg-white/[0.025] text-[#D9D4CC]",
  Sent: "border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]",
  "In Progress": "border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#F8F7F4]",
  Completed: "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]",
  Cancelled: "border-[#64131A]/35 bg-[#64131A]/18 text-[#F8F7F4]",

  Pending: "border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#F8F7F4]",
  Approved: "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]",

  Rescheduled: "border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]",
  Done: "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]",
};

const lightStatusStyles = {
  New: "border-[#B88A45] bg-[#D6A75D] text-[#171411]",
  Sent: "border-[#B88A45] bg-[#D6A75D] text-[#171411]",
  Pending: "border-[#B88A45] bg-[#D6A75D] text-[#171411]",
  "In Progress": "border-[#B88A45] bg-[#D6A75D] text-[#171411]",
  Read: "border-[#171411]/20 bg-[#171411]/5 text-[#171411]",
  Replied: "border-[#171411]/20 bg-[#171411]/5 text-[#171411]",
  Archived: "border-[#171411]/16 bg-transparent text-[#6D6862]",
  Reviewed: "border-[#171411]/20 bg-[#171411]/5 text-[#171411]",
  Accepted: "border-[#171411] bg-[#171411] text-[#F7F2EC]",
  Rejected: "border-[#171411]/35 bg-transparent text-[#171411]",
  Draft: "border-[#171411]/16 bg-transparent text-[#6D6862]",
  Completed: "border-[#171411] bg-[#171411] text-[#F7F2EC]",
  Cancelled: "border-[#171411]/35 bg-transparent text-[#171411]",
  Approved: "border-[#171411] bg-[#171411] text-[#F7F2EC]",
  Rescheduled: "border-[#B88A45] bg-[#D6A75D] text-[#171411]",
  Done: "border-[#171411] bg-[#171411] text-[#F7F2EC]",
};

function StatusBadge({ status = "New", tone = "dark" }) {
  const { translateValue } = useLanguage();
  const style = tone === "light"
    ? lightStatusStyles[status] || "border-[#171411]/20 bg-[#171411]/5 text-[#171411]"
    : statusStyles[status] || "border-white/10 bg-white/[0.04] text-[#D9D4CC]";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
    >
      {translateValue("statuses", status)}
    </span>
  );
}

export default StatusBadge;
