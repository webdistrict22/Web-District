import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import CaseStudySection from "../../components/work/CaseStudySection";
import FinalCTA from "../../components/home/FinalCTA";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getFallbackProjectBySlug } from "../../data/demoProjects";
import useLanguage from "../../hooks/useLanguage";

function CaseStudy() {
  const { slug } = useParams();
  const { t } = useLanguage();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProject = async () => {
    setIsLoading(true);

    const fallbackProject = getFallbackProjectBySlug(slug);

    if (fallbackProject) {
      setProject(fallbackProject);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get(`/projects/public/${slug}`);

      setProject(data.project);
    } catch (error) {
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (isLoading) {
    return (
      <main className="wd-section-black pb-20 pt-32">
        <Container>
          <Loader text={t("work.caseStudy.loading")} />
        </Container>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="wd-section-black pb-20 pt-32">
        <Container>
          <div className="wd-card-on-black rounded-[2rem] p-8 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
              {t("work.caseStudy.eyebrow")}
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold tracking-[-0.06em]">
              {t("work.caseStudy.notFoundTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-[#D9D4CC]">
              {t("work.caseStudy.notFoundDescription")}
            </p>

            <div className="mt-8">
              <Button to="/work">{t("common.buttons.backToWork")}</Button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <>
      <main className="wd-section-black pb-12 pt-32">
        <Container>
          <CaseStudySection project={project} />
        </Container>
      </main>

      <FinalCTA liveUrl={project.liveUrl} />
    </>
  );
}

export default CaseStudy;
