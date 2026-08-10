import { CheckCircle2 } from "lucide-react";
import { useLocation, useSearchParams } from "react-router";
import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import PageMeta from "../../components/common/PageMeta";
import "../../components/public/PublicUtilityPages.css";
import { formatSlotSummary } from "../../components/start/slotFormatting";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import { normalizeSuccessType } from "../../lib/successFlow";

const successConfig = {
  call: { accountPath: "/account/appointments" },
  request: { accountPath: "/account/requests" },
};

function Success() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { effectiveLanguage, t } = useLanguage();
  const type = normalizeSuccessType(searchParams.get("type"));
  const content = t(`success.${type}`, {});
  const callSummary = type === "call"
    ? formatSlotSummary(location.state?.slot, effectiveLanguage)
    : "";

  return (
    <section className="wd-success-page">
      <PageMeta
        title={t("success.metaTitle")}
        description={t("success.metaDescription")}
        robots="noindex,nofollow"
      />

      <Container>
        <article className="wd-success-surface">
          <div className="wd-success-surface__marker">
            <span>{content.eyebrow}</span>
            <CheckCircle2 aria-hidden="true" />
          </div>

          <div className="wd-success-layout">
            <div className="wd-success-copy">
              <h1 className="font-display">{content.title}</h1>
              <p>{content.description}</p>

              {callSummary ? (
                <div className="wd-success-time">
                  <span>{content.timeLabel}</span>
                  <strong dir="auto">{callSummary}</strong>
                </div>
              ) : null}
            </div>

            <div className="wd-success-next">
              <p>{t("success.next")}</p>
              <ol className="wd-success-steps">
                {content.steps.map((step, index) => (
                  <li key={step}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="wd-success-actions">
                <Button
                  to={isAuthenticated ? successConfig[type].accountPath : "/start"}
                  className="wd-final-cta-action--dark"
                >
                  {isAuthenticated ? content.accountLabel : t("success.startAnother")}
                </Button>
                <Button
                  to="/"
                  icon={false}
                  className="wd-final-cta-action--light"
                >
                  {t("common.buttons.backHome")}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}

export default Success;
