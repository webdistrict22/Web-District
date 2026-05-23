import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import { processSteps } from "../../data/siteData";

function ProcessPreview() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Process"
          title="A clear process from request to launch."
          description="The process keeps the project organized, clear, and easier for the client from the first message to the final launch."
          center
          className="mb-12"
        />

        <div className="grid gap-4 md:grid-cols-5">
          {processSteps.map((step, index) => (
            <Card key={step.title} className="p-5">
              <p className="font-display text-sm text-[#C69A4E]">0{index + 1}</p>
              <h3 className="font-display mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{step.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ProcessPreview;