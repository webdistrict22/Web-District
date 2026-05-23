import { useParams } from "react-router-dom";
import Container from "../../components/common/Container";
import CaseStudySection from "../../components/work/CaseStudySection";
import FinalCTA from "../../components/home/FinalCTA";
import { workProjects } from "../../data/demoProjects";

function CaseStudy() {
  const { slug } = useParams();

  const project = workProjects.find((item) => item.slug === slug && !item.isComingSoon);

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
            This project may be coming soon or the link may be incorrect.
          </p>
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