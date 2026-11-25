import { SiteChrome } from "@/components/chrome/SiteChrome";
import { Aboard } from "@/components/sections/Aboard";
import { Close } from "@/components/sections/Close";
import { Hero } from "@/components/sections/Hero";
import { Lantern } from "@/components/sections/Lantern";
import { WaysToUse } from "@/components/sections/WaysToUse";

export default function Home() {
  return (
    <>
      <SiteChrome mode="home" />
      <main className="landing">
        <Hero />
        <WaysToUse />
        <Aboard />
        <Lantern />
        <Close />
      </main>
    </>
  );
}
