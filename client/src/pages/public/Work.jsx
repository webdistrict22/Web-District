import { useMemo, useState } from "react";
import api, { PUBLIC_CONTENT_TIMEOUT } from "../../lib/axios";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import ReviewsPreview from "../../components/home/ReviewsPreview";
import ProjectCard from "../../components/work/ProjectCard";
import PageMeta from "../../components/common/PageMeta";
import { mergeProjectsWithFallback } from "../../data/demoProjects";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

function Work() {
  const [projects, setProjects] = useState([]);
  const { t } = useLanguage();

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
    <main className="bg-[#080808]">
      <PageMeta
        title="Work"
        description="Explore selected Web District projects, website case studies, and digital work."
        canonical="/work"
      />

      <section className="wd-section-black pt-36 pb-4 md:pt-40 md:pb-4">
        <Container>
          <SectionHeader
            eyebrow={t("work.hero.eyebrow")}
            title={t("work.hero.title")}
            description={t("work.hero.description")}
          />
        </Container>
      </section>

      <section className="wd-section-black pt-4 pb-10 md:pt-6 md:pb-12">
        <Container>
          <section className="grid gap-6 md:grid-cols-2">
            {displayProjects.map((project) => (
              <ProjectCard
                key={project._id || project.slug}
                project={project}
                className="wd-card-on-black"
              />
            ))}
          </section>
        </Container>
      </section>

      <ReviewsPreview />
    </main>
  );
}

export default Work;
