import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import api from "../../lib/axios";
import { truncateText } from "../../lib/helpers";
import { mergeProjectsWithFallback } from "../../data/demoProjects";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import ProjectCover from "../work/ProjectCover";

function WorkPreview() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/projects/public", {
        params: {
          featured: "true",
        },
      });

      setProjects(data.projects || []);
    } catch (error) {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const displayProjects = useMemo(() => {
    const merged = mergeProjectsWithFallback(projects);
    return ["zohour", "s8-factory"]
      .map((slug) => merged.find((project) => project.slug === slug))
      .filter(Boolean);
  }, [projects]);

  return (
    <section className="wd-section-black py-16 md:py-20">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Some of our work"
            title="Selected builds, shown simply."
            description="Real examples with public websites, dashboards, and launch-ready flows."
          />
          <Button to="/work" variant="secondary">
            View Our Work
          </Button>
        </div>

        {isLoading ? (
          <Card className="wd-card-on-black p-6">
            <p className="text-[#D9D4CC]">Loading selected work...</p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {displayProjects.map((project) => {
              const isDatabaseProject = Boolean(project._id);
              const name = isDatabaseProject ? project.title : project.name;
              const type = isDatabaseProject ? project.websiteType : project.type;
              const description = isDatabaseProject
                ? project.shortDescription
                : project.description;
              const image = isDatabaseProject
                ? project.images?.[0]
                : project.coverImage || project.image;
              const slug = project.slug;
              const isComingSoon = project.isComingSoon;

              const card = (
                <Card
                  key={project._id || project.slug}
                  className={`wd-card-on-black group h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/30 ${
                    isComingSoon ? "opacity-80" : "cursor-pointer"
                  }`}
                >
                  <ProjectCover image={image} name={name} className="h-72 border-b border-white/10">
                    <div className="absolute bottom-5 left-5 right-5">
                      <Badge>{type}</Badge>
                      <h3 className="font-display mt-4 text-3xl font-bold tracking-[-0.05em]">
                        {name}
                      </h3>
                    </div>
                  </ProjectCover>

                  <div className="p-6">
                    <p className="text-sm leading-6 text-[#D9D4CC]">
                      {truncateText(description, 130)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C4A77D]">
                      {isComingSoon ? "Case study coming soon" : "Open case study"}
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Card>
              );

              if (isComingSoon) return card;

              return (
                <Link
                  key={project._id || project.slug}
                  to={`/work/${slug}`}
                  className="block h-full rounded-[1.6rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4A77D]"
                  aria-label={`Open ${name} case study`}
                >
                  {card}
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

export default WorkPreview;
