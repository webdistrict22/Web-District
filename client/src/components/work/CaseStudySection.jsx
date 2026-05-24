import { CheckCircle2, ExternalLink } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";

function CaseStudySection({ project }) {
  const isDatabaseProject = Boolean(project._id);

  const name = isDatabaseProject ? project.title : project.name;
  const type = isDatabaseProject ? project.websiteType : project.type;
  const overview = isDatabaseProject
    ? project.fullDescription || project.shortDescription
    : project.overview;
  const features = isDatabaseProject
    ? project.keyFeatures || []
    : project.features || [];
  const pages = isDatabaseProject
    ? project.pagesIncluded || []
    : project.pages || [];
  const tags = project.tags || [];
  const liveUrl = project.liveUrl || "";

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <Badge>{type}</Badge>

        <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1] tracking-[-0.07em] text-white md:text-7xl">
          {name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#94A3B8]">
          {overview}
        </p>

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

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button to="/start">Start a similar project</Button>
          <Button to="/work" variant="secondary">
            Back to work
          </Button>

          {liveUrl && (
            <Button href={liveUrl} variant="secondary" icon={false} target="_blank" rel="noreferrer">
              <ExternalLink size={17} />
              Visit website
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-72 border-b border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(198,154,78,0.22),transparent_32%),linear-gradient(135deg,#0A1A2D,#020817)] p-5">
          <div className="flex h-full items-end rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-6">
            <div>
              <p className="text-sm text-[#94A3B8]">Selected work</p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.05em]">
                {name} — {type}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="mb-4 font-semibold text-white">Key features</p>
            <div className="space-y-3">
              {features.length ? (
                features.map((feature) => (
                  <div key={feature} className="flex gap-2 text-sm text-[#CBD5E1]">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#C69A4E]" />
                    {feature}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#94A3B8]">Features will be added soon.</p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-4 font-semibold text-white">Pages / structure</p>
            <div className="space-y-3">
              {pages.length ? (
                pages.map((page) => (
                  <div
                    key={page}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#CBD5E1]"
                  >
                    {page}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#94A3B8]">Pages will be added soon.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CaseStudySection;