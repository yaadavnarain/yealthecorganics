export const PAGES = ['Homepage','Membership','Agribusiness'];
export const DEPENDENCY = ['Yes','No','Not sure','I didn’t read this information.'];
export const RATINGS = ['Very unclear','Somewhat unclear','Neither clear nor unclear','Somewhat clear','Very clear','I didn’t read this page.'];
export const THANK_YOU = 'Thank you for your feedback. Your comments will help us review and improve the website’s wording.';
export function validateFeedback(input){
 const errors={};
 if(!input||typeof input!=='object'||Array.isArray(input))return{ok:false,errors:{form:'Please check your answers.'}};
 const keys=['pagesRead','membershipUnderstanding','agribusinessUnderstanding','membershipRequired','clarity','confusing','unanswered','improvement'];
 if(Object.keys(input).some(k=>![...keys,'token','requestKey','website'].includes(k)))errors.form='Please send only the feedback fields.';
 const text=(key,required,max)=>{const raw=input[key];if(raw!==undefined&&typeof raw!=='string'){errors[key]='Enter a written answer.';return '';}const v=(raw||'').trim().normalize('NFC').replace(/\r\n/g,'\n');if((required&&!v)||[...v].length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(v))errors[key]=required?`Enter a short answer (up to ${max} characters). “Not sure” is allowed.`:`Use up to ${max} characters.`;return v;};
 const pagesRead=input.pagesRead;
 if(!Array.isArray(pagesRead)||!pagesRead.length||pagesRead.length>3||new Set(pagesRead).size!==pagesRead.length||pagesRead.some(p=>!PAGES.includes(p)))errors.pagesRead='Select at least one page you read.';
 const membershipUnderstanding=text('membershipUnderstanding',true,1200),agribusinessUnderstanding=text('agribusinessUnderstanding',true,1200);
 if(!DEPENDENCY.includes(input.membershipRequired))errors.membershipRequired='Choose one answer.';
 const clarity=input.clarity;
 if(!clarity||typeof clarity!=='object'||Array.isArray(clarity)||Object.keys(clarity).length!==3||PAGES.some(p=>!RATINGS.includes(clarity[p])))errors.clarity='Rate each page, or choose “I didn’t read this page.”';
 const confusing=text('confusing',false,2000),unanswered=text('unanswered',false,2000),improvement=text('improvement',false,2000);
 if(Object.keys(errors).length)return{ok:false,errors};
 return {
  ok: true,
  errors,
  value: {
   pagesRead: [...pagesRead],
   membershipUnderstanding,
   agribusinessUnderstanding,
   membershipRequired: input.membershipRequired,
   clarity: {...clarity},
   confusing, unanswered, improvement
  }
 };
}
