import { useId, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import useLanguage from "../../hooks/useLanguage";

function FAQTabs({ categories }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(null);
  const tabRefs = useRef([]);
  const baseId = useId().replaceAll(":", "");
  const { isRtl } = useLanguage();
  const active = categories[activeCategory];

  if (!active) return null;

  const selectCategory = (index, focus = false) => {
    setActiveCategory(index);
    setOpenQuestion(null);
    if (focus) {
      window.requestAnimationFrame(() => tabRefs.current[index]?.focus());
    }
  };

  const handleTabKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = categories.length - 1;
    if (event.key === "ArrowRight") {
      nextIndex = (index + (isRtl ? -1 : 1) + categories.length) % categories.length;
    }
    if (event.key === "ArrowLeft") {
      nextIndex = (index + (isRtl ? 1 : -1) + categories.length) % categories.length;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    selectCategory(nextIndex, true);
  };

  return (
    <div className="wd-faq-tabs">
      <div className="wd-faq-tabs__scroller wd-scrollbar">
        <div className="wd-faq-tabs__list" role="tablist" aria-label={active.groupLabel}>
          {categories.map((category, index) => {
            const isActive = index === activeCategory;

            return (
              <button
                key={category.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`${baseId}-tab-${category.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${category.id}`}
                tabIndex={isActive ? 0 : -1}
                className={isActive ? "is-active" : ""}
                onClick={() => selectCategory(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${baseId}-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className={`wd-faq-tabs__panel${openQuestion === null ? " is-closed" : " is-open"}`}
      >
        {active.items.map((item, index) => {
          const isOpen = openQuestion === index;
          const buttonId = `${baseId}-${active.id}-question-${index}`;
          const panelId = `${baseId}-${active.id}-answer-${index}`;

          return (
            <article className={`wd-faq-row${isOpen ? " is-open" : ""}`} key={item.question}>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenQuestion(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span className="wd-faq-row__icon" aria-hidden="true">
                  {isOpen ? <Minus /> : <Plus />}
                </span>
              </button>

              {isOpen ? (
                <div id={panelId} role="region" aria-labelledby={buttonId}>
                  <p>{item.answer}</p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default FAQTabs;
