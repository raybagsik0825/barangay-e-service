import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Announcements from "@/components/Announcements";
import Projects from "@/components/Projects";
import HearingTracker from "@/components/HearingTracker";
import CrimeRegistry from "@/components/CrimeRegistry";
import LostAndFound from "@/components/LostAndFound";
import PnpPortal from "@/components/PnpPortal";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <Announcements />
      <Projects />
      <HearingTracker />
      <CrimeRegistry />
      <LostAndFound />
      <PnpPortal />
    </>
  );
}
