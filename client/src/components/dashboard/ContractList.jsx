import { useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe2,
  MessageSquare,
} from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import Textarea from "../common/Textarea";
import { formatDate } from "../../lib/helpers";
import { confirmAction } from "../../lib/alerts";
import useLanguage from "../../hooks/useLanguage";

function ContractList({
  contracts = [],
  setContracts,
  emptyMode = "client",
  allowClientActions = false,
}) {
  const [activeNoteId, setActiveNoteId] = useState("");
  const [noteDrafts, setNoteDrafts] = useState({});
  const [loadingId, setLoadingId] = useState("");
  const { effectiveLanguage, getErrorMessage, t, translateValue } = useLanguage();

  if (!contracts.length) {
    return (
      <EmptyState
        title={t("client.contracts.emptyTitle")}
        description={
          emptyMode === "client"
            ? t("client.contracts.emptyClient")
            : t("client.contracts.emptyAdmin")
        }
        actionText={emptyMode === "client" ? t("common.buttons.startRequest") : undefined}
        actionTo={emptyMode === "client" ? "/start" : undefined}
      />
    );
  }

  const updateContractInState = (updatedContract) => {
    if (!setContracts) return;

    setContracts((prev) =>
      prev.map((contract) =>
        contract._id === updatedContract._id ? updatedContract : contract
      )
    );
  };

  const handleAccept = async (contract) => {
    const confirmed = await confirmAction({
      title: t("client.contracts.acceptTitle"),
      message: t("client.contracts.acceptMessage"),
      confirmText: t("client.contracts.acceptConfirm"),
    });

    if (!confirmed) return;

    try {
      setLoadingId(contract._id);

      const { data } = await api.put(`/contracts/${contract._id}/accept`, {
        clientNotes: noteDrafts[contract._id] ?? contract.clientNotes ?? "",
      });

      updateContractInState(data.contract);

      toast.success(t("client.contracts.acceptedSuccess"));
    } catch (error) {
      toast.error(
        getErrorMessage(error, "client.contracts.acceptError")
      );
    } finally {
      setLoadingId("");
    }
  };

  const handleSaveNote = async (contract) => {
    try {
      setLoadingId(contract._id);

      const { data } = await api.put(`/contracts/${contract._id}/client-note`, {
        clientNotes: noteDrafts[contract._id] ?? contract.clientNotes ?? "",
      });

      updateContractInState(data.contract);

      toast.success(t("client.contracts.noteSaved"));
      setActiveNoteId("");
    } catch (error) {
      toast.error(getErrorMessage(error, "client.contracts.noteError"));
    } finally {
      setLoadingId("");
    }
  };

  const openNoteBox = (contract) => {
    setActiveNoteId(contract._id);
    setNoteDrafts((prev) => ({
      ...prev,
      [contract._id]: prev[contract._id] ?? contract.clientNotes ?? "",
    }));
  };

  return (
    <div className="grid gap-5">
      {contracts.map((contract) => {
        const canAccept =
          allowClientActions &&
          ["Draft", "Sent"].includes(contract.status);

        const canSendNote = allowClientActions;

        return (
          <Card key={contract._id} className="p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <div className="mb-4 flex flex-wrap gap-3">
                  <StatusBadge status={contract.status} />

                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
                    {translateValue("websiteTypes", contract.websiteType)}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
                    {formatDate(contract.createdAt, effectiveLanguage)}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
                  {contract.title}
                </h3>

                <p className="mt-2 text-sm text-[#D9D4CC]">
                  {contract.businessName || contract.clientName}
                </p>

                <p className="mt-5 max-w-4xl leading-8 text-[#D9D4CC]">
                  {contract.scopeSummary}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-4">
              <InfoItem
                icon={CreditCard}
                label={t("common.labels.totalPrice")}
                value={
                  contract.totalPrice
                    ? `${contract.totalPrice.toLocaleString()} EGP`
                    : t("common.labels.notSet")
                }
              />

              <InfoItem
                icon={CreditCard}
                label={`${t("common.labels.deposit")} (${contract.depositPercent || 70}%)`}
                value={
                  contract.depositAmount
                    ? `${contract.depositAmount.toLocaleString()} EGP`
                    : t("common.labels.notSet")
                }
              />

              <InfoItem
                icon={CreditCard}
                label={t("common.labels.remaining")}
                value={
                  contract.remainingAmount
                    ? `${contract.remainingAmount.toLocaleString()} EGP`
                    : t("common.labels.notSet")
                }
              />

              <InfoItem
                icon={CalendarDays}
                label={t("common.labels.deadline")}
                value={contract.deadline || t("common.labels.notSet")}
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ListBlock
                icon={FileText}
                title={t("common.labels.pagesIncluded")}
                items={contract.pagesIncluded}
              />

              <ListBlock
                icon={Globe2}
                title={t("common.labels.featuresIncluded")}
                items={contract.featuresIncluded}
              />
            </div>

            {contract.paymentNotes && (
              <div className="mt-5 rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/8 p-4">
                <p className="text-sm font-semibold text-[#F8F7F4]">
                  {t("common.labels.paymentNotes")}
                </p>
                <p className="mt-2 leading-7 text-[#F8F7F4]/85">
                  {contract.paymentNotes}
                </p>
              </div>
            )}

            {contract.clientNotes && (
              <div className="mt-5 rounded-2xl border border-[#C4A77D]/15 bg-[#C4A77D]/5 p-4">
                <p className="text-sm font-semibold text-[#D9D4CC]">
                  {t("common.labels.clientNote")}
                </p>
                <p className="mt-2 leading-7 text-[#D9D4CC]/85">
                  {contract.clientNotes}
                </p>
              </div>
            )}

            {allowClientActions && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {canAccept && (
                    <Button
                      type="button"
                      onClick={() => handleAccept(contract)}
                      disabled={loadingId === contract._id}
                      icon={false}
                    >
                      <CheckCircle2 size={17} />
                      {loadingId === contract._id
                        ? t("client.contracts.accepting")
                        : t("client.contracts.acceptProposal")}
                    </Button>
                  )}

                  {canSendNote && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => openNoteBox(contract)}
                      icon={false}
                    >
                      <MessageSquare size={17} />
                      {t("client.contracts.sendNote")}
                    </Button>
                  )}
                </div>

                {activeNoteId === contract._id && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <Textarea
                      label={t("client.contracts.noteLabel")}
                      placeholder={t("client.contracts.notePlaceholder")}
                      value={noteDrafts[contract._id] || ""}
                      onChange={(e) =>
                        setNoteDrafts((prev) => ({
                          ...prev,
                          [contract._id]: e.target.value,
                        }))
                      }
                      rows={5}
                    />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        onClick={() => handleSaveNote(contract)}
                        disabled={loadingId === contract._id}
                      >
                        {loadingId === contract._id
                          ? t("client.contracts.saving")
                          : t("client.contracts.saveNote")}
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setActiveNoteId("")}
                      >
                        {t("common.buttons.cancel")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
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

function ListBlock({ icon: Icon, title, items = [] }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={17} className="text-[#C4A77D]" />
        <p className="text-sm font-semibold text-[#F8F7F4]">{title}</p>
      </div>

      {items.length ? (
        <div className="grid gap-2">
          {items.map((item) => (
            <p key={item} className="text-sm text-[#D9D4CC]">
              • {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#D9D4CC]">
          {t("common.labels.notAddedYet")}
        </p>
      )}
    </div>
  );
}

export default ContractList;
