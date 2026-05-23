import Button from "./Button";
import Card from "./Card";

function EmptyState({
  title = "Nothing here yet",
  description = "Once there is data, it will appear here.",
  actionText,
  actionTo,
}) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto mb-5 h-14 w-14 rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10" />

      <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-xl leading-7 text-[#94A3B8]">
        {description}
      </p>

      {actionText && actionTo && (
        <div className="mt-6">
          <Button to={actionTo}>{actionText}</Button>
        </div>
      )}
    </Card>
  );
}

export default EmptyState;