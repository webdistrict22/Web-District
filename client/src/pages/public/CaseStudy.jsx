import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import CaseStudySection from "../../components/work/CaseStudySection";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import PageMeta from "../../components/common/PageMeta";
import { getFallbackProjectBySlug } from "../../data/demoProjects";
import useLanguage from "../../hooks/useLanguage";

function CaseStudy() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const fallbackProject = getFallbackProjectBySlug(slug);

  const [project, setProject] = useState(fallbackProject || null);
  const [isLoading, setIsLoading] = useState(!fallbackProject);

  const fetchProject = useCallback(async () => {
    const routeFallbackProject = getFallbackProjectBySlug(slug);

    if (routeFallbackProject) {
      setProject(routeFallbackProject);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.get(`/projects/public/${slug}`);

      setProject(data.project);
    } catch {
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const timerId = window.setTimeout(fetchProject, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchProject]);

  const projectName = project?.title || project?.name;
  const rawOverview = project
    ? project._id
      ? project.fullDescription || project.shortDescription
      : project.overview
    : "";
  const metaTitle = projectName
    ? `${projectName} ${t("work.caseStudy.eyebrow")}`
    : t("work.caseStudy.eyebrow");
  const metaDescription = projectName
    ? t(`work.projects.${project.slug}.overview`, rawOverview)
    : t("work.caseStudy.notFoundDescription");
  const pageMeta = (
    <PageMeta
      title={metaTitle}
      description={metaDescription}
      canonical={`/work/${slug}`}
      image={project?.coverImage}
      type="article"
      robots={!isLoading && !project ? "noindex,nofollow" : "index,follow"}
      structuredData={project ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: projectName,
        description: metaDescription,
        url: `https://www.web-district.com/work/${slug}`,
        ...(project.coverImage ? { image: new URL(project.coverImage, "https://www.web-district.com").toString() } : {}),
      } : undefined}
    />
  );

  if (isLoading) {
    return (
      <>
        {pageMeta}
        <section className="wd-section-black pb-20 pt-32">
          <Container>
            <Loader text={t("work.caseStudy.loading")} />
          </Container>
        </section>
      </>
    );
  }

  if (!project) {
    return (
      <>
        {pageMeta}
        <section className="wd-section-black pb-20 pt-32">
          <Container>
            <div className="wd-card-on-black rounded-[2rem] p-8 md:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-[var(--wd-signature-gold)]">
                {t("work.caseStudy.eyebrow")}
              </p>
              <h1 className="font-display mt-4 text-5xl font-bold tracking-[-0.06em]">
                {t("work.caseStudy.notFoundTitle")}
              </h1>
              <p className="mt-4 max-w-xl text-[var(--wd-stone-gray)]">
                {t("work.caseStudy.notFoundDescription")}
              </p>

              <div className="mt-8">
                <Button to="/work">{t("common.buttons.backToWork")}</Button>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      {pageMeta}
      <CaseStudySection project={project} />
    </>
  );
}

export default CaseStudy;
