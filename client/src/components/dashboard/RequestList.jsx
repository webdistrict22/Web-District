import { FileText } from "lucide-react";
import PortalEmptyState from "../portal/PortalEmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";
import useLanguage from "../../hooks/useLanguage";

function RequestList({ requests = [] }) {
  const { effectiveLanguage, t, translateValue } = useLanguage();

  if (!requests.length) {
    return (
      <PortalEmptyState
        icon={FileText}
        title={t("client.requests.emptyTitle")}
        description={t("client.requests.emptyDescription")}
        actionText={t("common.buttons.submitRequest")}
        actionTo="/start"
      />
    );
  }

  return (
    <div className="wd-portal-record-list">
      {requests.map((request) => {
        const metadata = [
          { label: t("common.labels.phone"), value: request.phone, ltr: true },
          { label: t("common.labels.email"), value: request.email, ltr: true },
          {
            label: t("common.labels.preferredContact"),
            value: translateValue("contactMethods", request.preferredContactMethod),
          },
          { label: t("common.labels.budget"), value: request.budgetRange },
          { label: t("common.labels.deadline"), value: request.deadline },
          {
            label: t("common.labels.brandIdentity"),
            value: translateValue("yesNo", request.hasBrandIdentity),
          },
          {
            label: t("common.labels.contentReady"),
            value: translateValue("yesNo", request.hasContentReady),
          },
        ].filter((item) => item.value);

        return (
          <article key={request._id} className="wd-portal-record">
            <div className="wd-portal-record__heading">
              <div className="min-w-0">
                <div className="wd-portal-record__topline">
                  <StatusBadge status={request.status} tone="light" />
                  <span className="wd-portal-record__type">
                    {translateValue("websiteTypes", request.websiteType)}
                  </span>
                </div>
                <h2 className="wd-portal-record__title wd-value-wrap">
                  {request.businessName || request.name}
                </h2>
              </div>
              <time className="wd-portal-record__date" dateTime={request.createdAt}>
                {t("client.requests.submittedOn", undefined, {
                  date: formatDate(request.createdAt, effectiveLanguage),
                })}
              </time>
            </div>

            <p className="wd-portal-record__description wd-value-wrap">
              {request.projectDetails}
            </p>

            {metadata.length ? (
              <div className="wd-portal-record__meta">
                {metadata.map((item) => (
                  <MetaItem key={item.label} {...item} />
                ))}
              </div>
            ) : null}

            {request.adminNotes ? (
              <div className="wd-portal-note">
                <p className="wd-portal-note__label">{t("common.labels.adminNote")}</p>
                <p className="wd-portal-note__text wd-value-wrap">{request.adminNotes}</p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function MetaItem({ label, value, ltr = false }) {
  return (
    <div className="wd-portal-meta">
      <p className="wd-portal-meta__label">{label}</p>
      <p
        dir={ltr ? "ltr" : undefined}
        className={`wd-portal-meta__value${ltr ? " wd-ltr" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

export default RequestList;
