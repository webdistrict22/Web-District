import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

function AdminTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = "No data found",
  emptyDescription = "Data will appear here once available.",
  rowKey = "_id",
}) {
  if (isLoading) {
    return <Loader text="Loading data..." />;
  }

  if (!data.length) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="border-b border-white/10 bg-white/[0.035]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-[#94A3B8]"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row[rowKey] || rowIndex}
                className="border-b border-white/10 last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-5 py-4 text-sm text-[#CBD5E1]"
                  >
                    {typeof column.render === "function"
                      ? column.render(row)
                      : row[column.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;