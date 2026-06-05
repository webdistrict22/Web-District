import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Card from "../common/Card";
import ProjectCover from "./ProjectCover";
import { truncateText } from "../../lib/helpers";
import useLanguage from "../../hooks/useLanguage";

function ProjectCard({ project, className = "" }) {
  const { t, translateValue } = useLanguage();
  const isDatabaseProject = Boolean(project._id);

  const name = isDatabaseProject ? project.title : project.name;
  const slug = project.slug;
  const rawType = isDatabaseProject ? project.websiteType : project.type;
  const rawBusinessType = project.businessType || "";
  const rawDescription = isDatabaseProject
    ? project.shortDescription
    : project.description;
  const type = t(
    `work.projects.${slug}.type`,
    translateValue("websiteTypes", rawType)
  );
  const businessType = t(`work.projects.${slug}.businessType`, rawBusinessType);
  const description = t(`work.projects.${slug}.description`, rawDescription);
  const isComingSoon = project.isComingSoon;
  const image = isDatabaseProject
    ? project.images?.[0]
    : project.coverImage || project.image;

  const card = (
    <Card
      className={`group h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/35 ${className} ${
        isComingSoon ? "opacity-80" : "cursor-pointer"
      }`}
    >
      <ProjectCover image={image} name={name} className="h-72 border-b border-white/10">
        <div className="absolute bottom-5 left-5 right-5">
          <div>
            <p className="text-sm text-[#D9D4CC]">{type}</p>
            <h3 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-[#F8F7F4]">
              {name}
            </h3>
          </div>
        </div>
      </ProjectCover>

      <div className="p-6">
          {businessType && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-[#C4A77D]">
            {businessType}
          </p>
        )}

        <p className="leading-7 text-[#D9D4CC]">{truncateText(description, 140)}</p>

        <span className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-[#D9D4CC] transition group-hover:border-[#C4A77D]/45 group-hover:text-[#C4A77D]">
          {isComingSoon ? t("work.comingSoon") : t("work.openCaseStudy")}
          <ArrowUpRight size={17} />
        </span>
      </div>
    </Card>
  );

  if (isComingSoon) return card;

  return (
    <Link
      to={`/work/${slug}`}
      className="block h-full rounded-[1.6rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4A77D]"
      aria-label={t("work.ariaOpen", undefined, { name })}
    >
      {card}
    </Link>
  );
}

export default ProjectCard;
