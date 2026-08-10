import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Button from "../common/Button";
import useLanguage from "../../hooks/useLanguage";

function ProcessStepper({ steps }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isRtl, t } = useLanguage();
  const activeStep = steps[activeIndex];
  const PreviousIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  if (!activeStep) return null;

  const releaseTouchFocus = (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

    const control = event.currentTarget;
    window.requestAnimationFrame(() => {
      if (document.activeElement === control) control.blur();
    });
  };

  return (
    <div className="wd-process-stepper" aria-label={t("process.controls.stepperLabel")}>
      <div className="wd-process-stepper__progress" dir="ltr">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;

          return (
            <button
              key={step.number}
              type="button"
              className={`wd-process-stepper__node${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-current={isActive ? "step" : undefined}
              aria-label={t("process.controls.stepLabel", undefined, {
                current: index + 1,
                total: steps.length,
                title: step.title,
              })}
            >
              <span className="wd-process-stepper__node-circle">{step.number}</span>
              <strong dir={isRtl ? "rtl" : "ltr"}>{step.title}</strong>
            </button>
          );
        })}
      </div>

      <article
        className="wd-process-stepper__panel"
        dir="ltr"
        key={`${activeStep.number}-${activeStep.title}`}
      >
        <div className="wd-process-stepper__identity" dir={isRtl ? "rtl" : "ltr"}>
          <span className="wd-process-stepper__count">{activeStep.number}</span>
          <p className="wd-process-stepper__eyebrow">{activeStep.subtitle}</p>
          <h2 className="font-display">{activeStep.title}</h2>
        </div>

        <div className="wd-process-stepper__details" dir={isRtl ? "rtl" : "ltr"}>
          <p className="wd-process-stepper__description">{activeStep.description}</p>

          <div className="wd-process-stepper__points" aria-label={t("process.controls.keyPoints")}>
            {activeStep.points.map((point) => (
              <div key={point}>
                <Check aria-hidden="true" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <div className="wd-process-stepper__controls" dir="ltr">
        <button
          type="button"
          dir={isRtl ? "rtl" : "ltr"}
          onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
          onPointerCancel={releaseTouchFocus}
          onPointerUp={releaseTouchFocus}
          disabled={activeIndex === 0}
          aria-label={t("process.controls.previousAria")}
        >
          <PreviousIcon aria-hidden="true" />
          <span>{t("process.controls.previous")}</span>
        </button>

        {activeIndex === steps.length - 1 ? (
          <Button to="/start" className="wd-process-stepper__start">
            {t("common.buttons.startProject")}
          </Button>
        ) : (
          <button
            type="button"
            className="is-next"
            dir={isRtl ? "rtl" : "ltr"}
            onClick={() =>
              setActiveIndex((current) => Math.min(steps.length - 1, current + 1))
            }
            onPointerCancel={releaseTouchFocus}
            onPointerUp={releaseTouchFocus}
            aria-label={t("process.controls.nextAria")}
          >
            <span>{t("process.controls.next")}</span>
            <NextIcon aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProcessStepper;
