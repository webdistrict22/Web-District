import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import PageMeta from "../../components/common/PageMeta";
import ProcessTimeline from "../../components/process/ProcessTimeline";
import useLanguage from "../../hooks/useLanguage";

function Process() {
  const [openQuestion, setOpenQuestion] = useState("");
  const { t } = useLanguage();
  const fullProcessSteps = t("process.steps", []);
  const processQuestions = t("process.questions", []);

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Process"
        description="See how Web District plans, builds, and launches professional websites."
      />

      <section className="wd-section-black pt-32 pb-6 md:pb-8">
        <Container>
          <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <SectionHeader
              eyebrow={t("process.hero.eyebrow")}
              title={t("process.hero.title")}
              description={t("process.hero.description")}
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
              eyebrow={t("process.questionsHeader.eyebrow")}
              title={t("process.questionsHeader.title")}
              description={t("process.questionsHeader.description")}
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
                  {t("process.cta.eyebrow")}
                </p>

                <h2 className="font-display text-4xl font-bold tracking-[-0.06em] md:text-5xl">
                  {t("process.cta.title")}
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-[#D9D4CC]">
                  {t("process.cta.description")}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Button to="/start">{t("common.buttons.startProject")}</Button>
                <Button to="/work" variant="secondary">
                  {t("common.buttons.viewWork")}
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
