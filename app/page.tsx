import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { FounderSection } from "@/app/components/founder-section";
import { HomeContent } from "./homepage/content";
import styles from "./homepage/homepage.module.css";

export const metadata = {
  title: { absolute: "Financial Freedom for the Youth" },
};

export default function Page() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <HomeContent section="hero" />
        <HomeContent section="offers" />
        <FounderSection />
        <HomeContent section="faq" />
        <HomeContent section="closing" />
      </main>
      <Footer />
    </div>
  );
}
