import { useState } from "react";
import Container from "../../components/common/Container";
import PageMeta from "../../components/common/PageMeta";
import StartOptions from "../../components/start/StartOptions";
import WebsiteRequestForm from "../../components/start/WebsiteRequestForm";
import BookCallForm from "../../components/start/BookCallForm";
import WhatsappAlternative from "../../components/start/WhatsappAlternative";
import useLanguage from "../../hooks/useLanguage";
import "./Start.css";

function Start() {
  const [activeOption, setActiveOption] = useState("request");
  const { t } = useLanguage();
  const isRequestMode = activeOption === "request";

  return (
    <div className="wd-start-page">
      <PageMeta
        title={t("start.hero.eyebrow")}
        description={t("start.hero.description")}
        canonical="/start"
      />

      <section className="wd-start-hero">
        <Container>
          <div className="wd-start-hero__copy">
            <p>{t("start.hero.eyebrow")}</p>
            <h1>{t("start.hero.title")}</h1>
            <span>{t("start.hero.description")}</span>
          </div>
        </Container>
      </section>

      <section className="wd-start-paths">
        <Container>
          <StartOptions
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        </Container>
      </section>

      <section className="wd-start-workspace">
        <Container>
          <div
            key={activeOption}
            id="start-active-panel"
            role="tabpanel"
            aria-labelledby={`start-path-${activeOption}`}
            className="wd-start-active-panel"
          >
            {isRequestMode ? (
              <WebsiteRequestForm />
            ) : (
              <BookCallForm />
            )}
          </div>
        </Container>
      </section>

      <section className="wd-start-whatsapp" aria-label={t("start.whatsapp.ariaLabel")}>
        <Container>
          <WhatsappAlternative />
        </Container>
      </section>
    </div>
  );
}

export default Start;
