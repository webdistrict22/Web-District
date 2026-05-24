import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import CaseStudySection from "../../components/work/CaseStudySection";
import FinalCTA from "../../components/home/FinalCTA";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { workProjects } from "../../data/demoProjects";

function CaseStudy() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProject = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/projects/public/${slug}`);

      setProject(data.project);
    } catch (error) {
      const fallbackProject = workProjects.find(
        (item) => item.slug === slug && !item.isComingSoon
      );

      setProject(fallbackProject || null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (isLoading) {
    return (
      <main className="pb-20 pt-32">
        <Container>
          <Loader text="Loading case study..." />
        </Container>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="pb-20 pt-32">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-[#C69A4E]">
            Case study
          </p>
          <h1 className="font-display mt-4 text-5xl font-bold tracking-[-0.06em]">
            Case study not found
          </h1>
          <p className="mt-4 max-w-xl text-[#94A3B8]">
            This project may be coming soon, hidden, or the link may be incorrect.
          </p>

          <div className="mt-8">
            <Button to="/work">Back to work</Button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <>
      <main className="pb-10 pt-32">
        <Container>
          <CaseStudySection project={project} />
        </Container>
      </main>

      <FinalCTA />
    </>
  );
}

export default CaseStudy;