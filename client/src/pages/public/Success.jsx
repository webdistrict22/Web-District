import { CalendarDays, CheckCircle2, ClipboardList, Home } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Container from "../../components/common/Container";
import PageMeta from "../../components/common/PageMeta";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

const successConfig = {
  call: {
    icon: CalendarDays,
    accountPath: "/account/appointments",
  },
  request: {
    icon: ClipboardList,
    accountPath: "/account/requests",
  },
};

function Success() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const content = useMemo(() => {
    const type = searchParams.get("type");
    const safeType = successConfig[type] ? type : "request";

    return {
      ...successConfig[safeType],
      ...t(`success.${safeType}`, {}),
    };
  }, [searchParams, t]);

  const Icon = content.icon;

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title={t("success.metaTitle")}
        description={t("success.metaDescription")}
        robots="noindex,nofollow"
      />

      <section className="relative overflow-hidden border-b border-[#F8F7F4]/10 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(100,19,26,0.16),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(196,167,125,0.13),transparent_34%),linear-gradient(180deg,rgba(248,247,244,0.035),transparent_42%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C4A77D]/55 to-transparent" />

        <Container className="relative">
          <Card className="mx-auto max-w-4xl overflow-hidden border-[#C4A77D]/25 bg-[#0B0B0B] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.34)] md:p-10">
            <div className="grid gap-9 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div className="rounded-[1.4rem] border border-[#C4A77D]/18 bg-[linear-gradient(145deg,rgba(196,167,125,0.12),rgba(248,247,244,0.035),rgba(100,19,26,0.08))] p-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#C4A77D]">
                  <CheckCircle2 size={30} />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
                  {content.eyebrow}
                </p>

                <h1 className="font-display mt-4 text-4xl font-bold tracking-[-0.06em] text-[#F8F7F4] md:text-5xl">
                  {content.title}
                </h1>

                <p className="mt-5 leading-8 text-[#D9D4CC]">
                  {content.description}
                </p>
              </div>

              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="wd-accent-line" />
                  <Icon size={18} className="text-[#C4A77D]" />
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C4A77D]">
                    {t("success.next")}
                  </p>
                </div>

                <div className="grid gap-3">
                  {content.steps.map((step, index) => (
                    <div
                      key={step}
                      className="grid grid-cols-[44px_1fr] items-center gap-4 rounded-2xl border border-[#F8F7F4]/10 bg-[#F8F7F4]/[0.035] p-4"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C4A77D]/22 bg-[#C4A77D]/10 text-sm font-bold text-[#C4A77D]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="leading-7 text-[#F8F7F4]">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {isAuthenticated ? (
                    <Button to={content.accountPath} className="text-[#F8F7F4]">
                      {content.accountLabel}
                    </Button>
                  ) : (
                    <Button to="/start" className="text-[#F8F7F4]">
                      {t("success.startAnother")}
                    </Button>
                  )}

                  <Button to="/" variant="secondary" icon={false}>
                    <Home size={17} />
                    {t("common.buttons.backHome")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}

export default Success;
