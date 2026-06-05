import PageMeta from "../../components/common/PageMeta";
import HeroSection from "../../components/home/HeroSection";
import ServicesPreview from "../../components/home/ServicesPreview";
import WorkPreview from "../../components/home/WorkPreview";
import FinalCTA from "../../components/home/FinalCTA";
import useLanguage from "../../hooks/useLanguage";

function Home() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta
        title={t("home.metaTitle")}
        description={t("home.metaDescription")}
      />

      <HeroSection />
      <ServicesPreview />
      <WorkPreview />
      <FinalCTA />
    </>
  );
}

export default Home;
