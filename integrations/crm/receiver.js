// Apps Script source; not deployed. Requires approved Sheets and MailApp grants.
// Substitute the private target ID only in the owner-controlled Apps Script deployment.
const CRM_ID = 'REPLACE_WITH_PRIVATE_CRM_SPREADSHEET_ID';
const ALERT_TO = 'notifications@yealth.mu';
const FORM_TABS = { 'membership-reservation': 'Membership Reservations', 'agribusiness-reservation': 'Agribusiness Reservations' };
function crmReceive(event, services) {
  if (!event || !FORM_TABS[event.form] || !/^[a-f0-9-]{36}$/i.test(event.id) || !Number.isFinite(Date.parse(event.createdAt))) throw new Error('INVALID_EVENT');
  const p = event.payload;
  if (!p || ['firstName','lastName','email','phone','address'].some(k => typeof p[k] !== 'string' || p[k].length > 500)) throw new Error('INVALID_EVENT');
  if (event.form === 'membership-reservation' ? !Array.isArray(p.ranking) || p.ranking.length !== 10 || p.ranking.some(x => typeof x !== 'string' || x.length > 100) : ![1500,3000,4500].includes(p.contribution)) throw new Error('INVALID_EVENT');
  const tab = FORM_TABS[event.form];
  const safe = x => /^[=+\-@\t\r]/.test(String(x)) ? "'" + x : String(x);
  const values = [event.id,event.createdAt,p.firstName,p.lastName,p.email,p.phone,p.address,event.form === 'membership-reservation' ? p.ranking.join(' > ') : String(p.contribution)].map(safe);
  // Lock held by caller. Locate by immutable ID to recover an ambiguous Sheet acknowledgement.
  const row = services.upsert(tab,event.id,values);
  const state = services.status(tab,row);
  if (state === 'sent' || state === 'review') return { sheet: 'saved', alert: state };
  if (state === 'sending') { services.setStatus(tab,row,'review'); return {sheet:'saved',alert:'review'}; }
  if (!services.hasQuota()) return {sheet:'saved',alert:'retry'};
  // Persist intent before sending. A crash/ambiguous send becomes manual review, never blind resend.
  services.setStatus(tab,row,'sending');
  try {
    services.send({to:ALERT_TO,subject:'New ' + (event.form === 'membership-reservation' ? 'Membership' : 'Agribusiness') + ' submission',body:'A new submission has been received. Open the private CRM Sheet: https://docs.google.com/spreadsheets/d/' + CRM_ID + '/edit'});
    services.setStatus(tab,row,'sent');
    return {sheet:'saved',alert:'sent'};
  } catch (_) {
    services.setStatus(tab,row,'review');
    return {sheet:'saved',alert:'review'};
  }
}
function doPost(e) {
  const reply = value => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || e.postData.contents.length > 16000) throw new Error('INVALID');
    const envelope = JSON.parse(e.postData.contents), key = PropertiesService.getScriptProperties().getProperty('CRM_SIGNING_SECRET');
    if (!key || typeof envelope.data !== 'string' || typeof envelope.signature !== 'string' || !/^[a-f0-9]{64}$/.test(envelope.signature) || !Number.isSafeInteger(envelope.timestamp) || Math.abs(Date.now()-envelope.timestamp)>300000) throw new Error('INVALID');
    const digest = Utilities.computeHmacSha256Signature(envelope.timestamp+'.'+envelope.data,key).map(b=>(b&255).toString(16).padStart(2,'0')).join('');
    let mismatch=0; for(let i=0;i<64;i++) mismatch |= digest.charCodeAt(i)^envelope.signature.charCodeAt(i);
    if(mismatch) throw new Error('INVALID');
    if(!lock.tryLock(10000)) return reply({retry:true});
    const book=SpreadsheetApp.openById(CRM_ID);
    if(book.getId()!==CRM_ID) throw new Error('WRONG_SHEET');
    const sheet = name => { const s=book.getSheetByName(name); if(!s)throw new Error('MISSING_TAB'); return s; };
    const result=crmReceive(JSON.parse(envelope.data),{
      upsert(name,id,values) {
        const s=sheet(name), last=s.getLastRow();
        const found=last>1?s.getRange(2,1,last-1,1).createTextFinder(id).matchEntireCell(true).findNext():null;
        if(found)return found.getRow();
        const row=last+1; if(row>s.getMaxRows())s.insertRowsAfter(s.getMaxRows(),100);
        s.getRange(row,1,1,9).setNumberFormat('@').setValues([[...values,'pending']]); SpreadsheetApp.flush(); return row;
      },
      status:(name,row)=>sheet(name).getRange(row,9).getValue(),
      setStatus(name,row,value){sheet(name).getRange(row,9).setValue(value);SpreadsheetApp.flush();},
      hasQuota:()=>MailApp.getRemainingDailyQuota()>0,
      send:message=>MailApp.sendEmail(message),
    });
    return reply(result);
  } catch (_) { return reply({retry:true}); }
  finally { if(lock.hasLock())lock.releaseLock(); }
}
if(typeof module!=='undefined')module.exports={crmReceive};
