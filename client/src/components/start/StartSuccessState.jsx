import { CheckCircle2, Home } from "lucide-react";
import Button from "../common/Button";
import useLanguage from "../../hooks/useLanguage";

const successContent = {
  request: {
    titleKey: "start.confirmation.requestTitle",
    descriptionKey: "start.confirmation.requestDescription",
  },
  call: {
    titleKey: "start.confirmation.callTitle",
  },
};

function StartSuccessState({ type, summary = "" }) {
  const { t } = useLanguage();
  const content = successContent[type];

  return (
    <div className="wd-start-confirmation" role="status" aria-live="polite">
      <CheckCircle2
        className="wd-start-confirmation__icon"
        size={42}
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <h2>{t(content.titleKey)}</h2>
      {type === "call" && summary ? (
        <p className="wd-start-confirmation__summary" dir="auto">
          {summary}
        </p>
      ) : null}
      {content.descriptionKey ? <p>{t(content.descriptionKey)}</p> : null}

      <div className="wd-start-confirmation__actions">
        <Button to="/" variant="secondaryLight" icon={false}>
          <Home size={17} aria-hidden="true" />
          {t("start.confirmation.returnHome")}
        </Button>
      </div>
    </div>
  );
}

export default StartSuccessState;
