import PageMeta from "../../components/common/PageMeta";
import HeroSection from "../../components/home/HeroSection";
import GoldMarquee from "../../components/home/GoldMarquee";
import ResponsiveVideo from "../../components/home/ResponsiveVideo";
import ServicesPreview from "../../components/home/ServicesPreview";
import WorkPreview from "../../components/home/WorkPreview";
import ReviewsPreview from "../../components/home/ReviewsPreview";
import FinalCTA from "../../components/home/FinalCTA";
import useLanguage from "../../hooks/useLanguage";
import "../../components/home/HomepageSections.css";

function Home() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta
        title={t("home.metaTitle")}
        description={t("home.metaDescription")}
        canonical="/"
      />

      <HeroSection />
      <GoldMarquee />
      <ResponsiveVideo />
      <ServicesPreview />
      <WorkPreview />
      <ReviewsPreview />
      <FinalCTA />
    </>
  );
}

export default Home;
