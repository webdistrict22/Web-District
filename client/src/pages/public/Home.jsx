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