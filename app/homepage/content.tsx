import { ArrowRight, ChevronDown } from "lucide-react";
import { BrandEquation } from "@/app/components/yealth-equation";
import styles from "./homepage.module.css";

function ReservationLink({ membership = false }: { membership?: boolean }) {
  return <a className={`${styles.button} ${membership ? styles.mint : styles.amber}`}
    href={membership ? "https://yealth.mu/membership" : "https://yealth.mu/agribusiness"}>
    {membership ? "Earn & Save Now" : "Become an Agribusiness Owner"}
    <ArrowRight size={18} aria-hidden="true" />
  </a>;
}

function ReservationLinks() {
  return <div className={styles.buttons}><ReservationLink /><ReservationLink membership /></div>;
}

const FAQ = [
  ["What is yealth?", "yealth helps young adults aged 18–45 build towards financial freedom through agribusiness ownership, career and business development, and earning opportunities."],
  ["Can I choose both Agribusiness and Membership?", "Yes. They are two different offers, and you can choose either or both depending on your goals."],
  ["Do I need yealth Membership to become an agribusiness owner?", "No. Agribusiness ownership is available independently."],
  ["How do I get started?", "Visit the Agribusiness page to reserve your agribusiness, or the Membership page to reserve your membership."],
];

export function HomeContent({ section }: { section: "hero" | "offers" | "faq" | "closing" }) {
  if (section === "hero") return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroGroup}>
      <div className={styles.heroInner}>
        <h1 id="home-title">Financial Freedom for the Youth.</h1>
        <p className={styles.subheadline}>Become an agribusiness owner, develop your career and business skills, and make nutritious food part of your routine.</p>
        <ReservationLinks />
      </div>
      <div className={styles.heroAnimation}><BrandEquation trigger="load" /></div>
      </div>
    </section>
  );
  if (section === "offers") return <>
    <section id="about" className={styles.offer} aria-labelledby="agribusiness-title">
      <p className={styles.eyebrow}>yealth Agribusiness</p>
      <h2 id="agribusiness-title">Be Part of a New Generation of Agribusiness Owners.</h2>
      <p>yealth handles farm construction, farm operations and produce distribution. You can own and grow an agribusiness without managing its daily operations yourself.</p>
      <p>Learn how the business works, what ownership involves and what you need to consider before deciding.</p>
      <div className={styles.singleButton}><ReservationLink /></div>
    </section>
    <section id="how-it-works" className={`${styles.offer} ${styles.membership}`} aria-labelledby="membership-title">
      <p className={styles.eyebrow}>yealth Membership</p>
      <h2 id="membership-title">While Your Agribusiness Grows, Membership Supports Your Daily Needs and Goals.</h2>
      <p>yealth Membership helps you earn, develop new skills, pursue your ambitions and work towards financial stability through your own efforts.</p>
      <p>Learn what Membership offers, how it works and how it can help you achieve your goals before deciding.</p>
      <div className={styles.singleButton}><ReservationLink membership /></div>
    </section>
  </>;
  if (section === "faq") return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <h2 id="faq-title">FAQ</h2>
      <div className={styles.questions}>
        {FAQ.map(([question, answer], index) => (
          <details key={question} open={index === 0}>
            <summary>{question}<ChevronDown size={20} aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
  return (
    <section id="contact" className={styles.closing} aria-labelledby="closing-title">
      <h2 id="closing-title">Own a business. Build your skills. Create more opportunities for your future.</h2>
      <ReservationLinks />
    </section>
  );
}
