import { CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import ProjectCover from "./ProjectCover";
import useLanguage from "../../hooks/useLanguage";

function BulletList({ items = [], fallbackDetail }) {
  const visibleItems = items.length ? items : [fallbackDetail];

  return (
    <div className="grid gap-3">
      {visibleItems.map((item) => (
        <div
          key={item}
          className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-[#D9D4CC]"
        >
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#C4A77D]" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ShowcaseGallery({ images = [], name }) {
  const { t } = useLanguage();

  if (!images.length) return null;

  const [leadImage, ...supportingImages] = images.slice(0, 4);

  const getImageMeta = (item, index) => {
    const src = typeof item === "string" ? item : item.src;
    const title =
      typeof item === "string"
        ? `${t("work.caseStudy.screen")} ${index + 1}`
        : item.title;
    const alt =
      typeof item === "string"
        ? `${name} showcase ${index + 1}`
        : item.alt || `${name} ${title}`;

    return { src, title, alt };
  };

  const lead = getImageMeta(leadImage, 0);

  return (
    <section className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(248,247,244,0.03),rgba(248,247,244,0.012)),#0B0B0B] p-4 md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
            {t("work.caseStudy.showcase")}
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
            {t("work.caseStudy.showcaseTitle")}
          </h2>
        </div>
      </div>

      <div className="grid gap-5">
        <Card className="wd-card-on-black overflow-hidden border-[#C4A77D]/24">
          <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-2 md:p-3">
            <img
              src={lead.src}
              alt={lead.alt}
              className="h-full w-full rounded-[1.2rem] object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          {lead.title && (
            <p className="border-t border-white/10 px-5 py-4 text-sm font-semibold text-[#F8F7F4]">
              {lead.title}
            </p>
          )}
        </Card>

        {supportingImages.length > 0 && (
          <div className="grid gap-5 md:grid-cols-3">
            {supportingImages.map((item, index) => {
              const image = getImageMeta(item, index + 1);

              return (
                <Card key={image.src} className="wd-card-on-black overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.12),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-2">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full rounded-[1rem] object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {image.title && (
                    <p className="px-4 py-3 text-xs font-semibold text-[#F8F7F4]">
                      {image.title}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function CaseStudySection({ project }) {
  const { t, translateValue } = useLanguage();
  const isDatabaseProject = Boolean(project._id);

  const name = isDatabaseProject ? project.title : project.name;
  const slug = project.slug;
  const rawType = isDatabaseProject ? project.websiteType : project.type;
  const rawBusinessType = project.businessType || "";
  const rawOverview = isDatabaseProject
    ? project.fullDescription || project.shortDescription
    : project.overview;
  const rawPublicFeatures = isDatabaseProject
    ? project.keyFeatures || []
    : project.publicFeatures || project.features || [];
  const rawAdminFeatures = project.adminFeatures || [];
  const type = t(
    `work.projects.${slug}.type`,
    translateValue("websiteTypes", rawType)
  );
  const businessType = t(`work.projects.${slug}.businessType`, rawBusinessType);
  const overview = t(`work.projects.${slug}.overview`, rawOverview);
  const publicFeatures = t(
    `work.projects.${slug}.publicFeatures`,
    rawPublicFeatures
  );
  const adminFeatures = t(`work.projects.${slug}.adminFeatures`, rawAdminFeatures);
  const showcaseTitles = t(`work.projects.${slug}.showcaseTitles`, []);
  const showcaseImages = (
    project.showcaseImages ||
    (isDatabaseProject ? project.images?.slice(1) || [] : [])
  ).map((item, index) =>
    typeof item === "string"
      ? { src: item, title: showcaseTitles[index] }
      : { ...item, title: showcaseTitles[index] || item.title }
  );
  const image = isDatabaseProject
    ? project.images?.[0]
    : project.coverImage || project.image;

  return (
    <div className="grid gap-8">
      <section className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
        <div className="flex flex-col justify-center">
          <Badge>{type}</Badge>

          <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1] tracking-[-0.07em] text-[#F8F7F4] md:text-7xl">
            {name}
          </h1>

          {businessType && (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.32em] text-[#C4A77D]">
              {businessType}
            </p>
          )}

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#D9D4CC]">
            {overview}
          </p>

        </div>

        <Card className="wd-card-on-black group overflow-hidden">
          <ProjectCover
            image={image}
            name={name}
            className="min-h-[360px] lg:min-h-[520px]"
            imageLoading="eager"
            fetchPriority="high"
          >
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="font-display text-3xl font-bold tracking-[-0.05em]">
                {name} - {type}
              </h2>
            </div>
          </ProjectCover>
        </Card>
      </section>

      <ShowcaseGallery images={showcaseImages} name={name} />

      <section className="rounded-[2rem] bg-[#0B0B0B] p-4 md:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
        <Card className="wd-card-on-black p-6 md:p-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
            {t("work.caseStudy.publicFeatures")}
          </p>
          <BulletList
            items={publicFeatures}
            fallbackDetail={t("work.caseStudy.fallbackDetail")}
          />
        </Card>

        <Card className="wd-card-on-black p-6 md:p-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
            {t("work.caseStudy.adminFeatures")}
          </p>
          <BulletList
            items={adminFeatures}
            fallbackDetail={t("work.caseStudy.fallbackDetail")}
          />
        </Card>
        </div>
      </section>

    </div>
  );
}

export default CaseStudySection;
