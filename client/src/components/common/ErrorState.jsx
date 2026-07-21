import { AlertTriangle } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

function ErrorState({
  title = "Unable to load this data",
  message = "Something went wrong while loading the latest records.",
  retryLabel = "Retry",
  onRetry,
}) {
  return (
    <Card
      className="p-6 md:p-8"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#C4A77D]"
          >
            <AlertTriangle size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
              {title}
            </h2>
            <p className="wd-value-wrap mt-2 leading-7 text-[#D9D4CC]">
              {message}
            </p>
          </div>
        </div>

        {onRetry && (
          <Button type="button" onClick={onRetry} variant="secondary">
            {retryLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ErrorState;
