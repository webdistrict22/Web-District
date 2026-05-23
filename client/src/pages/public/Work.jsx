import { useMemo, useState } from "react";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import ProjectCard from "../../components/work/ProjectCard";
import ProjectFilters from "../../components/work/ProjectFilters";
import { workFilters, workProjects } from "../../data/demoProjects";

function Work() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return workProjects;

    return workProjects.filter((project) => {
      return project.type === activeFilter || project.tags.includes(activeFilter);
    });
  }, [activeFilter]);

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
              This is a selected work page, not a limit. Web District can build for brands, businesses, companies, campaigns, and custom digital needs.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <ProjectFilters
            filters={workFilters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </section>
      </Container>
    </main>
  );
}

export default Work;