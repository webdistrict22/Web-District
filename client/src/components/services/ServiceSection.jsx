import Container from "../common/Container";

function DetailList({ items, className = "" }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true" />
          <p>{item}</p>
        </li>
      ))}
    </ul>
  );
}

function ServiceHeader({ service, number, headingId, indicator }) {
  return (
    <>
      <div className="wd-service-section__meta">
        <span className="wd-service-section__number" dir="ltr">
          {number}
        </span>
        <span className="wd-service-section__category">{service.category}</span>
      </div>

      <h2 id={headingId} className="font-display">
        {service.title}
      </h2>
      <p className="wd-service-section__description">{service.description}</p>
      {indicator}
    </>
  );
}

function BestFor({ service, labels }) {
  return (
    <div className="wd-service-section__best-for">
      <h3>{labels.bestSuitedFor}</h3>
      <p>{service.bestFor}</p>
    </div>
  );
}

function ServiceDetails({ service, labels, id }) {
  return (
    <div id={id} className="wd-service-section__details">
      <div className="wd-service-section__detail-group">
        <h3>{labels.builtToAchieve}</h3>
        <DetailList
          items={service.outcomes}
          className="wd-service-section__outcomes"
        />
      </div>

      <div className="wd-service-section__detail-group">
        <h3>{labels.canInclude}</h3>
        <DetailList
          items={service.includes}
          className="wd-service-section__includes"
        />
        {service.scopeNote ? (
          <p className="wd-service-section__scope-note">{service.scopeNote}</p>
        ) : null}
      </div>
    </div>
  );
}

function ServiceSection({
  service,
  number,
  labels,
  isMobile,
  isExpanded,
  onToggle,
  onPanelPointerDown,
  onPanelClick,
}) {
  const headingId = `${service.id}-title`;
  const panelId = `${service.id}-details`;

  return (
    <section
      id={service.id}
      className={`wd-service-section wd-service-section--${service.tone}${
        service.reverse ? " wd-service-section--reverse" : ""
      }`}
      aria-labelledby={headingId}
    >
      <Container>
        <div className="wd-service-section__layout">
          {isMobile ? (
            <>
              <button
                type="button"
                className="wd-service-section__accordion-button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={onToggle}
              >
                <ServiceHeader
                  service={service}
                  number={number}
                  headingId={headingId}
                  indicator={
                    <span
                      className="wd-service-section__indicator"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 12 8" focusable="false">
                        <path d="M1 1.25 6 6.25l5-5" />
                      </svg>
                    </span>
                  }
                />
              </button>

              <div
                id={panelId}
                className={`wd-service-section__mobile-panel${
                  isExpanded
                    ? " wd-service-section__mobile-panel--expanded"
                    : ""
                }`}
                role="region"
                aria-labelledby={headingId}
                aria-hidden={!isExpanded}
                onPointerDown={onPanelPointerDown}
                onClick={onPanelClick}
              >
                <div className="wd-service-section__mobile-panel-inner">
                  <BestFor service={service} labels={labels} />
                  <ServiceDetails service={service} labels={labels} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="wd-service-section__intro">
                <ServiceHeader
                  service={service}
                  number={number}
                  headingId={headingId}
                />
                <BestFor service={service} labels={labels} />
              </div>

              <ServiceDetails service={service} labels={labels} />
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

export default ServiceSection;
