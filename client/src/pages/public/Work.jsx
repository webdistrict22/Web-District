import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import ProjectCard from "../../components/work/ProjectCard";
import ProjectFilters from "../../components/work/ProjectFilters";
import Loader from "../../components/common/Loader";
import { workFilters, workProjects } from "../../data/demoProjects";

function Work() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/projects/public");

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

  const displayProjects = projects.length ? projects : workProjects;

  const dynamicFilters = useMemo(() => {
    if (!projects.length) return workFilters;

    const types = projects.map((project) => project.websiteType).filter(Boolean);
    const tags = projects.flatMap((project) => project.tags || []);
    const unique = Array.from(new Set(["All", ...types, ...tags]));

    return unique;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return displayProjects;

    return displayProjects.filter((project) => {
      const type = project._id ? project.websiteType : project.type;
      const tags = project.tags || [];

      return type === activeFilter || tags.includes(activeFilter);
    });
  }, [activeFilter, displayProjects]);

  return (
    <main className="pb-20 pt-32">
      <Container>
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            eyebrow="Some of our work"
            title="Selected websites with a serious direction."
            description="A look at some Web District work across online stores, business websites, and future custom website directions."
          />

          <div className="rounded-[1.6rem] border border-[#C69A4E]/20 bg-[#C69A4E]/8 p-5">
            <p className="text-sm leading-7 text-[#F1D08B]">
              This is a selected work page, not a limit. Web District can build
              for brands, businesses, companies, campaigns, and custom digital
              needs.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <ProjectFilters
            filters={dynamicFilters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </section>

        {isLoading ? (
          <section className="mt-10">
            <Loader text="Loading selected work..." />
          </section>
        ) : (
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} />
            ))}
          </section>
        )}
      </Container>
    </main>
  );
}

export default Work;