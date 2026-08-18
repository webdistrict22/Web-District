import RouteMeta from "../../components/common/RouteMeta";
import HeroSection from "../../components/home/HeroSection";
import GoldMarquee from "../../components/home/GoldMarquee";
import ServicesPreview from "../../components/home/ServicesPreview";
import WorkPreview from "../../components/home/WorkPreview";
import ReviewsPreview from "../../components/home/ReviewsPreview";
import FinalCTA from "../../components/home/FinalCTA";
import "../../components/home/HomepageSections.css";

function Home() {
  return (
    <>
      <RouteMeta path="/" />

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
