import { CalendarDays, Globe2, Mail, Phone } from "lucide-react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { formatDate } from "../../lib/helpers";
import useLanguage from "../../hooks/useLanguage";

function RequestList({ requests = [] }) {
  const { t, translateValue } = useLanguage();

  if (!requests.length) {
    return (
      <EmptyState
        title={t("client.requests.emptyTitle")}
        description={t("client.requests.emptyDescription")}
        actionText={t("common.buttons.submitRequest")}
        actionTo="/start"
      />
    );
  }

  return (
    <div className="grid gap-5">
      {requests.map((request) => (
        <Card key={request._id} className="p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <StatusBadge status={request.status} />

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
                  {translateValue("websiteTypes", request.websiteType)}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
                {request.businessName || request.name}
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-[#D9D4CC]">
                {request.projectDetails}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#D9D4CC]">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[#C4A77D]" />
                {formatDate(request.createdAt)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem icon={Phone} label={t("common.labels.phone")} value={request.phone} />
            <InfoItem icon={Mail} label={t("common.labels.email")} value={request.email} />
            <InfoItem
              icon={Globe2}
              label={t("common.labels.brandIdentity")}
              value={translateValue("yesNo", request.hasBrandIdentity)}
            />
            <InfoItem
              icon={Globe2}
              label={t("common.labels.contentReady")}
              value={translateValue("yesNo", request.hasContentReady)}
            />
          </div>

          {(request.budgetRange || request.deadline || request.preferredContactMethod) && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {request.budgetRange && (
                <MiniInfo label={t("common.labels.budget")} value={request.budgetRange} />
              )}

              {request.deadline && (
                <MiniInfo label={t("common.labels.deadline")} value={request.deadline} />
              )}

              {request.preferredContactMethod && (
                <MiniInfo
                  label={t("common.labels.preferredContact")}
                  value={translateValue(
                    "contactMethods",
                    request.preferredContactMethod
                  )}
                />
              )}
            </div>
          )}

          {request.adminNotes && (
            <div className="mt-5 rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/8 p-4">
              <p className="text-sm font-semibold text-[#F8F7F4]">
                {t("common.labels.adminNote")}
              </p>
              <p className="mt-2 leading-7 text-[#F8F7F4]/85">
                {request.adminNotes}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <Icon size={17} className="mt-0.5 shrink-0 text-[#C4A77D]" />
      <div>
        <p className="text-xs text-[#D9D4CC]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#D9D4CC]">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs text-[#D9D4CC]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#D9D4CC]">{value}</p>
    </div>
  );
}

export default RequestList;
