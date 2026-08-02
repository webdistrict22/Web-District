import { Link } from "react-router-dom";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import useLanguage from "../../hooks/useLanguage";

function ProjectCard({ project, className = "", duplicate = false }) {
  const { isRtl, t, translateValue } = useLanguage();
  const DirectionalArrow = isRtl ? ArrowUpLeft : ArrowUpRight;
  const isDatabaseProject = Boolean(project._id);

  const slug = project.slug;
  const rawName = isDatabaseProject ? project.title : project.name;
  const name = t(`work.projects.${slug}.name`, rawName);
  const rawType = isDatabaseProject ? project.websiteType : project.type;
  const rawDescription = isDatabaseProject
    ? project.shortDescription
    : project.description;
  const type = t(
    `work.projects.${slug}.type`,
    translateValue("websiteTypes", rawType)
  );
  const description = t(`work.projects.${slug}.description`, rawDescription);
  const isComingSoon = project.isComingSoon;
  const image = isDatabaseProject
    ? project.images?.[0]
    : project.coverImage || project.image;

  const card = (
    <article className="wd-work-project-card">
      <div className="wd-work-project-card__image">
        {image ? (
          <img src={image} alt={name} loading="lazy" decoding="async" draggable="false" />
        ) : null}
      </div>
      <div className="wd-work-project-card__body">
        <p className="wd-work-project-card__category">{type}</p>
        <div className="wd-work-project-card__title-row">
          <h2 className="font-display">{name}</h2>
          <DirectionalArrow size={18} aria-hidden="true" />
        </div>
        <p className="wd-work-project-card__description">{description}</p>
      </div>
    </article>
  );

  if (isComingSoon) {
    return (
      <div className={`wd-work-project-link is-disabled ${className}`} aria-disabled="true">
        {card}
      </div>
    );
  }

  return (
    <Link
      to={`/work/${slug}`}
      className={`wd-work-project-link ${className}`}
      aria-label={t("work.ariaOpen", undefined, { name })}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      draggable="false"
    >
      {card}
    </Link>
  );
}

export default ProjectCard;
