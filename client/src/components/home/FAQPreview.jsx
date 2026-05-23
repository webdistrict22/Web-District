import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import api from "../../lib/axios";
import Container from "../common/Container";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";
import Button from "../common/Button";
import { faqs as fallbackFaqs } from "../../data/siteData";

function FAQPreview() {
  const [faqs, setFaqs] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/faqs/public");

      const publicFaqs = data.faqs || [];

      setFaqs(publicFaqs.length ? publicFaqs : fallbackFaqs);
      setActiveId(publicFaqs[0]?._id || fallbackFaqs[0]?.question || "");
    } catch (error) {
      setFaqs(fallbackFaqs);
      setActiveId(fallbackFaqs[0]?.question || "");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions before starting?"
            description="Clear answers for common questions about timelines, website types, calls, hosting, and custom work."
          />

          <Button to="/start" variant="secondary">
            Start a request
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <Card className="p-6">
              <p className="text-[#94A3B8]">Loading questions...</p>
            </Card>
          ) : (
            faqs.slice(0, 6).map((faq) => {
              const id = faq._id || faq.question;
              const isActive = activeId === id;

              return (
                <Card key={id} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveId(isActive ? "" : id)}
                    className="flex w-full items-center justify-between gap-5 p-6 text-left"
                  >
                    <h3 className="font-display text-xl font-bold tracking-[-0.04em] text-white">
                      {faq.question}
                    </h3>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#C69A4E] transition ${
                        isActive ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {isActive && (
                    <div className="border-t border-white/10 px-6 pb-6 pt-5">
                      <p className="max-w-4xl leading-8 text-[#94A3B8]">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </Container>
    </section>
  );
}

export default FAQPreview;