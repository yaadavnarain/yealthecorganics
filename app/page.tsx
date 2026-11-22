import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { FounderSection } from "@/app/components/founder-section";
import { SeedbedPane } from "@/app/components/seedbed-pane";
import { HomeContent } from "./homepage/content";
import styles from "./homepage/homepage.module.css";

export const metadata = {
  title: { absolute: "Financial Freedom for the Youth" },
};

export default function Page() {
  return (
    <div className={styles.page}>
      <SeedbedPane />
      <Navbar />
      <main>
        <HomeContent section="hero" />
        <HomeContent section="offers" />
        <FounderSection />
        <HomeContent section="faq" />
        <HomeContent section="closing" />
      </main>
      <div className={styles.footerFrame}><Footer /></div>
    </div>
  );
}
