function ProjectFilters({ filters, activeFilter, setActiveFilter }) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-[#C4A77D]/60 bg-[#C4A77D]/15 text-[#F8F7F4]"
                : "border-white/10 bg-white/[0.03] text-[#D9D4CC] hover:border-[#C4A77D]/35 hover:text-[#F8F7F4]"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}

export default ProjectFilters;