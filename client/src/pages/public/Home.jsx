import PageMeta from "../../components/common/PageMeta";
import HeroSection from "../../components/home/HeroSection";
import GoldMarquee from "../../components/home/GoldMarquee";
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
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Web District",
            url: "https://www.web-district.com/",
            email: "web.district22@gmail.com",
            sameAs: ["https://www.instagram.com/web__district"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Web District",
            url: "https://www.web-district.com/",
          },
        ]}
      />

      <HeroSection />
      <GoldMarquee />
      <ServicesPreview />
      <WorkPreview />
      <ReviewsPreview />
      <FinalCTA />
    </>
  );
}

export default Home;
