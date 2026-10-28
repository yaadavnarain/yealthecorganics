import type {Metadata} from 'next';
import Image from 'next/image';
import {FeedbackForm} from './feedback-form';
import styles from './feedback.module.css';
export const metadata:Metadata={title:'yealth Website Copy Feedback',description:'Help us improve the words and explanations on the yealth website.',robots:{index:false,follow:false},alternates:{canonical:'https://websitefeedback1.yealth.mu'},openGraph:{title:'yealth Website Copy Feedback',description:'Help us improve the words and explanations on our website.',url:'https://websitefeedback1.yealth.mu'}};
export default function FeedbackPage(){return <div className={styles.page}>
 <a className={styles.skip} href="#feedback">Skip to form</a>
 <header className={styles.header}><a href="https://yealth.mu" aria-label="yealth home"><Image src="/images/yealth-mark.png" width={683} height={336} alt="yealth" priority/></a></header>
 <main className={styles.main} id="feedback"><h1>yealth Website Copy Feedback</h1>
 <p>Help us improve the words and explanations on our website. Please read these three pages before answering:</p>
 <ul className={styles.pages}><li><a href="https://yealth.mu" target="_blank" rel="noopener noreferrer">Homepage</a></li><li><a href="https://yealth.mu/membership" target="_blank" rel="noopener noreferrer">Membership</a></li><li><a href="https://yealth.mu/agribusiness" target="_blank" rel="noopener noreferrer">Agribusiness</a></li></ul>
 <p>Answer based on what the website says, rather than what you already know as a shareholder. “Not sure” is useful feedback. Allow about 5 minutes after reading.</p>
 <FeedbackForm/>
 </main><footer className={styles.footer}><a href="https://yealth.mu/terms">Terms of Use</a><a href="https://yealth.mu/privacy">Privacy Policy</a></footer>
 </div>;}
