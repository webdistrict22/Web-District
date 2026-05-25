import Card from "../../components/common/Card";

function AdminPlaceholder({ title, description }) {
  return (
    <Card className="p-6 md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
        Admin dashboard
      </p>

      <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
        {title}
      </h2>

      <p className="mt-4 max-w-2xl leading-7 text-[#D9D4CC]">
        {description}
      </p>
    </Card>
  );
}

export default AdminPlaceholder;