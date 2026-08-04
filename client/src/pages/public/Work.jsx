import { useMemo, useState } from "react";
import api, { PUBLIC_CONTENT_TIMEOUT } from "../../lib/axios";
import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import ProjectCard from "../../components/work/ProjectCard";
import WorkCollection from "../../components/work/WorkCollection";
import WorkReviews from "../../components/work/WorkReviews";
import PageMeta from "../../components/common/PageMeta";
import { mergeProjectsWithFallback } from "../../data/demoProjects";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";
import "./Work.css";

function Work() {
  const [projects, setProjects] = useState([]);
  const { effectiveLanguage, t } = useLanguage();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects/public", {
        timeout: PUBLIC_CONTENT_TIMEOUT,
      });

      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    }
  };

  useInitialLoad(fetchProjects);

  const displayProjects = useMemo(
    () => mergeProjectsWithFallback(projects),
    [projects]
  );

  return (
    <div className="wd-work-page">
      <PageMeta
        title={t("work.hero.eyebrow")}
        description={t("work.hero.description")}
        canonical="/work"
      />

      <section className="wd-work-projects" aria-labelledby="work-page-title">
        <Container>
          <header className="wd-work-section-heading wd-work-section-heading--dark">
            <p className="wd-work-eyebrow">{t("work.hero.eyebrow")}</p>
            <h1 id="work-page-title" className="font-display">{t("work.hero.title")}</h1>
            <p>{t("work.hero.description")}</p>
          </header>

          <WorkCollection
            items={displayProjects}
            getKey={(project) => project._id || project.slug}
            renderItem={(project, options) => <ProjectCard project={project} {...options} />}
            ariaLabel={t("work.hero.eyebrow")}
            previousLabel={t("work.projectsPreviousAria")}
            nextLabel={t("work.projectsNextAria")}
            resetKey={effectiveLanguage}
          />
        </Container>
      </section>

      <WorkReviews />

      <section className="wd-work-cta" aria-labelledby="work-cta-title">
        <Container>
          <p className="wd-work-eyebrow">{t("work.finalCta.eyebrow")}</p>
          <h2 id="work-cta-title" className="font-display">{t("work.finalCta.title")}</h2>
          <p>{t("work.finalCta.description")}</p>
          <div className="wd-work-cta__actions">
            <Button to="/start" icon={false} className="wd-work-cta__primary">
              {t("common.buttons.startProject")}
            </Button>
            <Button to="/services" variant="secondary" icon={false} className="wd-work-cta__secondary">
              {t("common.buttons.viewServices")}
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Work;
