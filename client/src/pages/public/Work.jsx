import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import ReviewsPreview from "../../components/home/ReviewsPreview";
import ProjectCard from "../../components/work/ProjectCard";
import Loader from "../../components/common/Loader";
import { mergeProjectsWithFallback } from "../../data/demoProjects";

function Work() {
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

  const displayProjects = useMemo(
    () => mergeProjectsWithFallback(projects),
    [projects]
  );

  return (
    <main className="bg-[#080808]">
      <section className="wd-section-black pt-36 pb-4 md:pt-40 md:pb-4">
        <Container>
          <SectionHeader
            eyebrow="Some of our work"
            title="Selected websites with a serious direction."
            description="A look at selected builds across stores, business sites, and custom directions."
          />
        </Container>
      </section>

      <section className="wd-section-black pt-4 pb-16 md:pt-6 md:pb-20">
        <Container>
          {isLoading ? (
            <section>
              <Loader text="Loading selected work..." />
            </section>
          ) : (
            <section className="grid gap-6 md:grid-cols-2">
              {displayProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  className="wd-card-on-black"
                />
              ))}
            </section>
          )}
        </Container>
      </section>

      <ReviewsPreview />
    </main>
  );
}

export default Work;
