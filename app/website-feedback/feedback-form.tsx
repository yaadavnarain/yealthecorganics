'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {PAGES,DEPENDENCY,RATINGS,validateFeedback} from '@/lib/feedback/validation.mjs';
import styles from './feedback.module.css';
type Answers={pagesRead:string[];membershipUnderstanding:string;agribusinessUnderstanding:string;membershipRequired:string;clarity:Record<string,string>;confusing:string;unanswered:string;improvement:string};
const initial:Answers={pagesRead:[],membershipUnderstanding:'',agribusinessUnderstanding:'',membershipRequired:'',clarity:{Homepage:'',Membership:'',Agribusiness:''},confusing:'',unanswered:'',improvement:''};
export function FeedbackForm(){
 const [answers,setAnswers]=useState(initial),[errors,setErrors]=useState<Record<string,string>>({}),[message,setMessage]=useState(''),[pending,setPending]=useState(false),[saved,setSaved]=useState(false),[token,setToken]=useState('');
 const key=useRef(''),busy=useRef(false),trap=useRef<HTMLInputElement>(null),summary=useRef<HTMLDivElement>(null),success=useRef<HTMLDivElement>(null);
 async function prepare(){setToken('');try{const r=await fetch('/api/website-feedback',{cache:'no-store',credentials:'same-origin'}),d=await r.json();if(!r.ok||!d.token)throw Error();setToken(d.token);key.current=crypto.randomUUID();setMessage('');}catch{setMessage('Feedback storage is unavailable. Nothing can be saved right now. Please try again later.');}}
 useEffect(()=>{void prepare();},[]);
 function change(next:Answers){if(busy.current)return;setAnswers(next);key.current=crypto.randomUUID();setErrors({});}
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(busy.current||saved)return;const result=validateFeedback(answers);if(!result.ok){setErrors(result.errors as Record<string,string>);requestAnimationFrame(()=>summary.current?.focus());return;}busy.current=true;setPending(true);setMessage('');setErrors({});
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
  try{const r=await fetch('/api/website-feedback',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({...answers,token,requestKey:key.current,website:trap.current?.value||''}),signal:controller.signal}),d=await r.json();if(!r.ok){setErrors(d.errors||{});setMessage(d.message||'Could not save your feedback. Please try again.');if(r.status===400)void prepare();requestAnimationFrame(()=>summary.current?.focus());return;}setSaved(true);requestAnimationFrame(()=>success.current?.focus());}
  catch{setMessage('Could not confirm saving your feedback. Your answers are still here. Please try again.');}
  finally{clearTimeout(timeout);busy.current=false;setPending(false);}
 }
 if(saved)return <section ref={success} tabIndex={-1} className={styles.success} role="status"><h2>Thank you for your feedback.</h2><p>Your comments will help us review and improve the website’s wording.</p></section>;
 const error=(id:string)=>errors[id]?<p id={`${id}-error`} className={styles.error}>{errors[id]}</p>:null;
 const written=(id:keyof Answers,label:string,required=false,helper='')=><div className={styles.group}><label className={styles.question} htmlFor={id}>{label}{!required&&<span className={styles.optional}> (Optional)</span>}</label><p id={`${id}-help`} className={styles.helper}>{helper}</p><textarea className={styles.textarea} id={id} name={id} value={answers[id] as string} required={required} maxLength={required?1200:2000} aria-invalid={!!errors[id]} aria-describedby={`${id}-help${errors[id]?` ${id}-error`:''}`} onChange={e=>change({...answers,[id]:e.target.value})}/>{error(id)}</div>;
 return <form className={styles.form} onSubmit={submit} noValidate aria-busy={pending}>
 <div ref={summary} tabIndex={-1} role="alert">{Object.keys(errors).length>0&&<div className={styles.message}>Please check your answers.<ul>{Object.entries(errors).map(([id,text])=><li key={id}><a href={`#${id}`}>{text}</a></li>)}</ul></div>}{message&&<p className={styles.message}>{message}</p>}</div>
 <fieldset disabled={pending}>
 <fieldset className={styles.group} id="pagesRead" aria-describedby={errors.pagesRead?'pagesRead-error':undefined}><legend>1. Which pages did you read?</legend>{PAGES.map(p=><label className={styles.choice} key={p}><input type="checkbox" name="pagesRead" value={p} checked={answers.pagesRead.includes(p)} onChange={e=>change({...answers,pagesRead:e.target.checked?[...answers.pagesRead,p]:answers.pagesRead.filter(v=>v!==p)})}/>{p}</label>)}{error('pagesRead')}</fieldset>
 {written('membershipUnderstanding','2. Based on the website, what does yealth Membership provide, and what would someone pay? (Creole text is allowed)',true,'A short answer is enough. “Not sure” is allowed.')}
 {written('agribusinessUnderstanding','3. Based on the website, what does becoming an agribusiness owner involve, and what does yealth handle? (Creole text is allowed)',true,'A short answer is enough. “Not sure” is allowed.')}
 <fieldset className={styles.group} id="membershipRequired"><legend>4. Based on the website, is yealth Membership required to become an agribusiness owner?</legend>{DEPENDENCY.map(v=><label className={styles.choice} key={v}><input type="radio" name="membershipRequired" value={v} checked={answers.membershipRequired===v} required onChange={()=>change({...answers,membershipRequired:v})}/>{v}</label>)}{error('membershipRequired')}</fieldset>
 <fieldset className={styles.group} id="clarity"><legend>5. How clear was the wording on each page?</legend>{PAGES.map(p=><fieldset className={styles.rating} key={p}><legend>{p}</legend>{RATINGS.map(v=><label className={styles.choice} key={v}><input type="radio" name={`clarity-${p}`} value={v} checked={answers.clarity[p]===v} required onChange={()=>change({...answers,clarity:{...answers.clarity,[p]:v}})}/>{v}</label>)}</fieldset>)}{error('clarity')}</fieldset>
 {written('confusing','6. Which words or statements, if any, were confusing or could be understood in more than one way? (Creole text is allowed)',false,'Please name the page and quote the wording if possible.')}
 {written('unanswered','7. What questions, if any, did the website leave unanswered? (Creole text is allowed)',false,'Please say which page or offer they relate to.')}
 {written('improvement','8. What is the most useful change we could make to the website’s wording or explanations? (Creole text is allowed)',false,'Suggest something to add, remove or rewrite.')}
 <div className={styles.trap} aria-hidden="true"><label>Website<input ref={trap} name="website" tabIndex={-1} autoComplete="off"/></label></div>
 </fieldset><button className={styles.submit} type="submit" disabled={pending||!token}>{pending?'Sending…':'Send feedback'}</button>
 {!token&&message&&<button type="button" className={styles.submit} onClick={()=>void prepare()}>Try again</button>}
 </form>;
}
