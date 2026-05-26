import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import ProcessTimeline from "../../components/process/ProcessTimeline";
import { fullProcessSteps } from "../../data/processData";

const processQuestions = [
  {
    question: "What happens after I send a request?",
    answer:
      "We review the goal, website type, and details you send. Then we suggest the best direction and next step.",
  },
  {
    question: "Do I need everything ready before starting?",
    answer:
      "No. If you have the main idea, we can help shape the pages, structure, and content direction from there.",
  },
  {
    question: "Can I book a call first?",
    answer:
      "Yes. If you want to talk through the project before submitting details, you can start with a call.",
  },
  {
    question: "How do revisions work?",
    answer:
      "We share the work in clear stages, collect your notes, and adjust the website before launch.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We make sure the website is live, working properly, and ready for people to visit.",
  },
];

function Process() {
  const [openQuestion, setOpenQuestion] = useState("");

  return (
    <main className="bg-[#080808]">
      <section className="wd-section-black pt-32 pb-6 md:pb-8">
        <Container>
          <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <SectionHeader
              eyebrow="Process"
              title="A clear path from request to launch."
              description="Simple steps, clear process, and a website direction everyone understands."
            />
          </section>
        </Container>
      </section>

      <section className="wd-section-black pt-6 pb-16 md:pt-8">
        <Container>
          <ProcessTimeline steps={fullProcessSteps} cardClassName="wd-card-on-black" />
        </Container>
      </section>

      <section
        id="process-questions"
        className="wd-section-black scroll-mt-28 pt-0 pb-8 md:scroll-mt-32 md:pb-10"
      >
        <Container>
          <div className="mb-8">
            <SectionHeader
              eyebrow="Questions"
              title="Before we start."
              description="Quick answers about how the project moves."
            />
          </div>

          <div className="grid gap-3">
            {processQuestions.map((item) => {
              const isOpen = openQuestion === item.question;

              return (
                <article
                  key={item.question}
                  className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0B0B0B] shadow-[0_18px_70px_rgba(0,0,0,0.18)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(isOpen ? "" : item.question)
                    }
                    className="flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-white/[0.025] md:p-6"
                  >
                    <h3 className="font-display text-lg font-bold tracking-[-0.04em] text-[#F8F7F4] md:text-xl">
                      {item.question}
                    </h3>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#C4A77D] transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4 md:px-6 md:pb-6">
                      <p className="max-w-3xl leading-8 text-[#D9D4CC]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="wd-section-black py-16 md:py-20">
        <Container>
          <section className="overflow-hidden rounded-[2rem] border border-[#C4A77D]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                  Start with clarity
                </p>

                <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-5xl">
                  Tell us the goal.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-[#D9D4CC]">
                  We'll help shape the right website direction from there.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Button to="/start">Start Your Project</Button>
                <Button to="/work" variant="secondary">
                  View Our Work
                </Button>
              </div>
            </div>
          </section>
        </Container>
      </section>
    </main>
  );
}

export default Process;
