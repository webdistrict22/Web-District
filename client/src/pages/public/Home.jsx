import PageMeta from "../../components/common/PageMeta";
import HeroSection from "../../components/home/HeroSection";
import ServicesPreview from "../../components/home/ServicesPreview";
import WorkPreview from "../../components/home/WorkPreview";
import FinalCTA from "../../components/home/FinalCTA";

function Home() {
  return (
    <>
      <PageMeta
        title="Premium Web Studio"
        description="Web District builds clean, professional websites for brands, businesses, campaigns, and custom digital needs."
      />

      <HeroSection />
      <ServicesPreview />
      <WorkPreview />
      <FinalCTA />
    </>
  );
}

export default Home;
