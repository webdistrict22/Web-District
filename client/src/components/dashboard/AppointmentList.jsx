import { CalendarDays, Clock, Mail, MessageSquare, Phone } from "lucide-react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { formatDate } from "../../lib/helpers";
import useLanguage from "../../hooks/useLanguage";

function AppointmentList({ appointments = [] }) {
  const { t } = useLanguage();

  if (!appointments.length) {
    return (
      <EmptyState
        title={t("client.appointments.emptyTitle")}
        description={t("client.appointments.emptyDescription")}
        actionText={t("common.buttons.bookCall")}
        actionTo="/start"
      />
    );
  }

  return (
    <div className="grid gap-5">
      {appointments.map((appointment) => (
        <Card key={appointment._id} className="p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <StatusBadge status={appointment.status} />

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
                  {t("common.labels.callAppointment")}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
                {appointment.businessName || appointment.name}
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-[#D9D4CC]">
                {appointment.topic}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#D9D4CC]">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[#C4A77D]" />
                {formatDate(appointment.createdAt)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem icon={CalendarDays} label={t("common.labels.callDate")} value={appointment.slot?.date} />
            <InfoItem
              icon={Clock}
              label={t("common.labels.time")}
              value={
                appointment.slot
                  ? `${appointment.slot.startTime} - ${appointment.slot.endTime}`
                  : "-"
              }
            />
            <InfoItem icon={Phone} label={t("common.labels.phone")} value={appointment.phone} />
            <InfoItem icon={Mail} label={t("common.labels.email")} value={appointment.email} />
          </div>

          {appointment.notes && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex items-start gap-3">
                <MessageSquare size={17} className="mt-1 shrink-0 text-[#C4A77D]" />
                <div>
                  <p className="text-sm font-semibold text-[#F8F7F4]">
                    {t("common.labels.yourNotes")}
                  </p>
                  <p className="mt-2 leading-7 text-[#D9D4CC]">
                    {appointment.notes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {appointment.adminNotes && (
            <div className="mt-5 rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/8 p-4">
              <p className="text-sm font-semibold text-[#F8F7F4]">
                {t("common.labels.adminNote")}
              </p>
              <p className="mt-2 leading-7 text-[#F8F7F4]/85">
                {appointment.adminNotes}
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

export default AppointmentList;
