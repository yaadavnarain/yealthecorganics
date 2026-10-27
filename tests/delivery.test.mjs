import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHmac} from 'node:crypto';
import {deliverBatch} from '../lib/reservations/delivery.mjs';
const context={module:{exports:{}}};vm.runInNewContext(readFileSync(new URL('../integrations/crm/receiver.js',import.meta.url),'utf8'),context);
const receive=context.module.exports.crmReceive;
const event={id:'11111111-1111-4111-8111-111111111111',form:'agribusiness-reservation',createdAt:'2026-10-27T00:00:00Z',payload:{firstName:'=HYPERLINK("bad")',lastName:'TEST',email:'test@example.com',phone:'+2301234567',address:'TEST ADDRESS',contribution:1500}};
function fixture(){let state='pending',sends=[],rows=new Map();return{rows,sends,get state(){return state;},services:{upsert(tab,id,values){rows.set(tab+id,rows.get(tab+id)||values);return 2;},status:()=>state,setStatus:(_,__,s)=>{state=s;},hasQuota:()=>true,send:m=>sends.push(m)}};}
test('Sheet replay deduplicates ID, escapes formulas; alerts contain no contact data',()=>{const f=fixture();receive(event,f.services);receive(event,f.services);assert.equal(f.rows.size,1);assert.equal(f.sends.length,1);assert.equal(f.state,'sent');assert.ok([...f.rows.values()][0][2].startsWith("'="));assert.equal(f.sends[0].to,'notifications@yealth.mu');assert.ok(!JSON.stringify(f.sends).includes('test@example.com'));});
test('ambiguous send is marked review and never blindly resent; quota failure retries',()=>{const f=fixture();f.services.hasQuota=()=>false;assert.equal(receive(event,f.services).alert,'retry');assert.equal(f.state,'pending');f.services.hasQuota=()=>true;f.services.send=()=>{throw Error('timeout');};assert.equal(receive(event,f.services).alert,'review');assert.equal(receive(event,f.services).alert,'review');});
test('crash after sending intent recovers to review; invalid form rejected',()=>{const f=fixture();f.services.setStatus('x',2,'sending');assert.equal(receive(event,f.services).alert,'review');assert.throws(()=>receive({...event,form:'ugc'},f.services));});
test('worker signs requests and retains retry on timeout, handles manual review',async()=>{for(const mode of ['timeout','review']){const finished=[];await deliverBatch({store:{claim:async()=>[{id:event.id,lease:'lease',event}],finish:async(...a)=>finished.push(a)},endpoint:'https://script.google.com/macros/s/test/exec',secret:'x'.repeat(32),now:()=>123,fetcher:async(_,o)=>{const b=JSON.parse(o.body);assert.equal(b.signature,createHmac('sha256','x'.repeat(32)).update('123.'+b.data).digest('hex'));if(mode==='timeout')throw Error();return{ok:true,json:async()=>({sheet:'saved',alert:'review'})};}});assert.equal(finished[0][2],mode==='timeout'?'retry':'review');}});
test('web receiver rejects unsigned, altered and expired requests before spreadsheet access; no data in reply',()=>{
 let opened=0; const secret='x'.repeat(32), data=JSON.stringify(event), timestamp=Date.now();
 const ctx={module:{exports:{}},PropertiesService:{getScriptProperties:()=>({getProperty:()=>secret})},LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock(){}})},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>s})},Utilities:{computeHmacSha256Signature:(s,k)=>[...createHmac('sha256',k).update(s).digest()]},SpreadsheetApp:{openById:()=>{opened++;throw Error('fixture stop');}}};
 vm.runInNewContext(readFileSync(new URL('../integrations/crm/receiver.js',import.meta.url),'utf8'),ctx);
 const signed={timestamp,data,signature:createHmac('sha256',secret).update(timestamp+'.'+data).digest('hex')};
 for(const b of [{data,timestamp},{...signed,data:data+' '},{...signed,timestamp:timestamp-600000}])assert.equal(ctx.doPost({postData:{contents:JSON.stringify(b)}}),'{"retry":true}');
 assert.equal(opened,0); assert.equal(ctx.doPost({postData:{contents:JSON.stringify(signed)}}),'{"retry":true}');assert.equal(opened,1);
});
