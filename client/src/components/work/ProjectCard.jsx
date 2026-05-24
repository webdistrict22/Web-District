import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";

function ProjectCard({ project }) {
  const isDatabaseProject = Boolean(project._id);

  const name = isDatabaseProject ? project.title : project.name;
  const slug = project.slug;
  const type = isDatabaseProject ? project.websiteType : project.type;
  const description = isDatabaseProject
    ? project.shortDescription
    : project.description;
  const features = isDatabaseProject
    ? project.keyFeatures || []
    : project.features || [];
  const tags = isDatabaseProject ? project.tags || [] : project.tags || [];
  const isComingSoon = project.isComingSoon;

  return (
    <Card
      className={`group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[#C69A4E]/35 ${
        isComingSoon ? "opacity-80" : ""
      }`}
    >
      <div className="relative h-64 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_70%_20%,rgba(198,154,78,0.20),transparent_30%),linear-gradient(135deg,#0A1A2D,#020817)] p-5">
        <div className="absolute right-6 top-6 z-10">
          <Badge>
            {isComingSoon
              ? "Coming Soon"
              : isDatabaseProject && project.isFeatured
                ? "Featured"
                : "Selected"}
          </Badge>
        </div>

        <div className="flex h-full items-end rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-5 transition duration-500 group-hover:scale-[1.015]">
          <div>
            <p className="text-sm text-[#94A3B8]">{type}</p>
            <h3 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-white">
              {name}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="leading-7 text-[#94A3B8]">{description}</p>

        {features.length > 0 && (
          <div className="mt-6 grid gap-3">
            {features.slice(0, 4).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                <CheckCircle2 size={16} className="text-[#C69A4E]" />
                {feature}
              </div>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[#94A3B8]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-7">
          {isComingSoon ? (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-[#64748B]"
            >
              Case study coming soon
              <ArrowUpRight size={17} />
            </button>
          ) : (
            <Button to={`/work/${slug}`} variant="secondary">
              View case study
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;