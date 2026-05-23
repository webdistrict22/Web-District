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
                ? "border-[#C69A4E]/60 bg-[#C69A4E]/15 text-[#F1D08B]"
                : "border-white/10 bg-white/[0.03] text-[#94A3B8] hover:border-[#C69A4E]/35 hover:text-white"
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