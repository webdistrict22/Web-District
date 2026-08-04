import { useRef } from "react";
import { CalendarDays, FileText } from "lucide-react";
import useLanguage from "../../hooks/useLanguage";

const optionIcons = {
  request: FileText,
  call: CalendarDays,
};

function StartOptions({ activeOption, setActiveOption }) {
  const { isRtl, t } = useLanguage();
  const optionRefs = useRef({});
  const options = t("start.options.items", []).map((option) => ({
    ...option,
    icon: optionIcons[option.id] || FileText,
  }));

  const selectOption = (optionId) => {
    setActiveOption(optionId);
  };

  const handleKeyDown = (event, currentIndex) => {
    let nextIndex;

    if (event.key === "ArrowRight") {
      nextIndex =
        (currentIndex + (isRtl ? -1 : 1) + options.length) % options.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (currentIndex + (isRtl ? 1 : -1) + options.length) % options.length;
    } else if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextOption = options[nextIndex];
    selectOption(nextOption.id);
    optionRefs.current[nextOption.id]?.focus();
  };

  return (
    <div
      className="wd-start-path-selector"
      role="tablist"
      aria-label={t("start.options.ariaLabel")}
    >
      {options.map((option, index) => {
        const Icon = option.icon;
        const isActive = activeOption === option.id;

        return (
          <button
            key={option.id}
            ref={(node) => {
              optionRefs.current[option.id] = node;
            }}
            id={`start-path-${option.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="start-active-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => selectOption(option.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`wd-start-path-selector__option ${
              isActive ? "is-active" : ""
            }`}
          >
            <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
            <span>{option.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export default StartOptions;
