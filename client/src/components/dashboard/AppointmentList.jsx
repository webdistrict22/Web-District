import { CalendarDays } from "lucide-react";
import PortalEmptyState from "../portal/PortalEmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";
import { formatSlotDisplayParts } from "../start/slotFormatting";
import useLanguage from "../../hooks/useLanguage";

function AppointmentList({ appointments = [] }) {
  const { effectiveLanguage, t } = useLanguage();

  if (!appointments.length) {
    return (
      <PortalEmptyState
        icon={CalendarDays}
        title={t("client.appointments.emptyTitle")}
        description={t("client.appointments.emptyDescription")}
        actionText={t("common.buttons.bookCall")}
        actionTo="/start"
      />
    );
  }

  return (
    <div className="wd-portal-record-list">
      {appointments.map((appointment) => {
        const schedule = formatSlotDisplayParts(appointment.slot, effectiveLanguage);
        const metadata = [
          { label: t("common.labels.phone"), value: appointment.phone, ltr: true },
          { label: t("common.labels.email"), value: appointment.email, ltr: true },
          {
            label: t("client.appointments.bookedOn"),
            value: formatDate(appointment.createdAt, effectiveLanguage),
          },
        ].filter((item) => item.value);

        return (
          <article key={appointment._id} className="wd-portal-record wd-portal-appointment">
            <div className="wd-portal-record__heading">
              <div className="min-w-0">
                <div className="wd-portal-record__topline">
                  <StatusBadge status={appointment.status} tone="light" />
                  <span className="wd-portal-record__type">
                    {t("common.labels.callAppointment")}
                  </span>
                </div>
                <h2 className="wd-portal-record__title wd-value-wrap">
                  {appointment.businessName || appointment.name}
                </h2>
              </div>

              <div className="wd-portal-schedule">
                <time dateTime={appointment.slot?.startsAt || appointment.slot?.date}>
                  {schedule.date || t("common.labels.notSet")}
                </time>
                <p>
                  <span dir="ltr" className="wd-ltr">
                    {schedule.timeRange || t("common.labels.notSet")}
                  </span>
                  {schedule.timezoneLabel ? <span>· {schedule.timezoneLabel}</span> : null}
                </p>
              </div>
            </div>

            <p className="wd-portal-record__description wd-value-wrap">
              {appointment.topic}
            </p>

            {metadata.length ? (
              <div className="wd-portal-record__meta wd-portal-record__meta--compact">
                {metadata.map((item) => (
                  <MetaItem key={item.label} {...item} />
                ))}
              </div>
            ) : null}

            {appointment.notes ? (
              <div className="wd-portal-note wd-portal-note--neutral">
                <p className="wd-portal-note__label">{t("common.labels.yourNotes")}</p>
                <p className="wd-portal-note__text wd-value-wrap">{appointment.notes}</p>
              </div>
            ) : null}

            {appointment.adminNotes ? (
              <div className="wd-portal-note">
                <p className="wd-portal-note__label">{t("common.labels.adminNote")}</p>
                <p className="wd-portal-note__text wd-value-wrap">{appointment.adminNotes}</p>
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

export default AppointmentList;
