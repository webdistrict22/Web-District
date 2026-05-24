import PageMeta from "../../components/common/PageMeta";
import HeroSection from "../../components/home/HeroSection";
import ServicesPreview from "../../components/home/ServicesPreview";
import WorkPreview from "../../components/home/WorkPreview";
import ProcessPreview from "../../components/home/ProcessPreview";
import WhyWebDistrict from "../../components/home/WhyWebDistrict";
import ReviewsPreview from "../../components/home/ReviewsPreview";
import FAQPreview from "../../components/home/FAQPreview";
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
      <ProcessPreview />
      <WhyWebDistrict />
      <ReviewsPreview />
      <FAQPreview />
      <FinalCTA />
    </>
  );
}

export default Home;