import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import Container from "../common/Container";
import useSettings from "../../hooks/useSettings";

function HeroSection() {
  const { settings } = useSettings();

  return (
    <section className="wd-noise relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="absolute left-1/2 top-0 -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#0A1A2D] blur-[110px]" />
      <div className="absolute right-[8%] top-32 -z-10 h-52 w-52 rounded-full bg-[#C69A4E]/10 blur-[80px]" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#94A3B8]">
              <span className="h-1.5 w-10 rounded-full bg-[#C69A4E]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
              Premium web studio
            </div>

            <h1 className="font-display max-w-5xl text-5xl font-extrabold leading-[0.98] tracking-[-0.07em] wd-text-gradient md:text-7xl">
              {settings.heroHeadline}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#94A3B8]">
              {settings.heroSubtext}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button to="/start">{settings.primaryCTA || "Book your website"}</Button>
              <Button to="/work" variant="secondary">
                {settings.secondaryCTA || "View our work"}
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
              {["Clean design", "Built right", "Launched fast"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <CheckCircle2 size={17} className="text-[#C69A4E]" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="wd-card relative rounded-[2rem] p-5 md:p-7"
          >
            <div className="rounded-[1.4rem] border border-white/10 bg-[#020817]/65 p-6">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8]">Website direction</p>
                  <h3 className="font-display mt-1 text-2xl font-bold tracking-[-0.04em]">
                    Start with clarity
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C69A4E]/30 bg-[#C69A4E]/10 text-[#F1D08B]">
                  <ArrowUpRight size={22} />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Online store for products",
                  "Business website for trust",
                  "Landing page for campaigns",
                  "Custom website for special logic",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <span className="text-sm text-[#F5F8FC]">{item}</span>
                    <span className="font-display text-xs text-[#C69A4E]">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[#22D3EE]/15 bg-[#22D3EE]/5 p-4">
                <p className="text-sm leading-6 text-[#A7F3FF]">
                  The website should make people understand your business faster and trust it more.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;