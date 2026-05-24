import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { featuredProjects } from "../../data/siteData";

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
    return projects.length ? projects.slice(0, 2) : featuredProjects.slice(0, 2);
  }, [projects]);

  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Some of our work"
            title="A preview of websites built with a serious direction."
            description="We show some of our work, not every project, so the agency stays flexible and broad."
          />
          <Button to="/work" variant="secondary">
            View work
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-6">
            <p className="text-[#94A3B8]">Loading selected work...</p>
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
              const slug = isDatabaseProject ? project.slug : null;
              const tags = isDatabaseProject ? project.tags || [] : project.tags || [];

              return (
                <Card key={project._id || project.name} className="overflow-hidden">
                  <div className="h-56 border-b border-white/10 bg-[radial-gradient(circle_at_70%_20%,rgba(198,154,78,0.18),transparent_30%),linear-gradient(135deg,#0A1A2D,#020817)] p-5">
                    <div className="h-full rounded-[1.2rem] border border-white/10 bg-white/[0.035]" />
                  </div>

                  <div className="p-6">
                    <Badge>{type}</Badge>
                    <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.04em]">
                      {name}
                    </h3>
                    <p className="mt-4 leading-7 text-[#94A3B8]">
                      {description}
                    </p>

                    {tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
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

                    {slug && (
                      <div className="mt-6">
                        <Button to={`/work/${slug}`} variant="secondary">
                          View case study
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

export default WorkPreview;