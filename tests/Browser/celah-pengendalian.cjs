const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const esbuild = require('esbuild'), puppeteer = require('puppeteer');
async function main() {
 const root = path.resolve(__dirname, '../..'), dir = path.join(root, 'storage/app/celah-master-qa');
 fs.mkdirSync(dir, {recursive:true});
 const fixtures = JSON.parse(fs.readFileSync(path.join(root, 'storage/app/input-edit-qa/risk-fixtures.json'), 'utf8').replace(/^\uFEFF/, ''));
 const source = `import React from 'react';import {createRoot} from 'react-dom/client';
 import Index from './resources/js/Pages/Master/CelahPengendalian/Index.jsx';
 import Edit from './resources/js/Pages/Master/CelahPengendalian/Edit.jsx';
 import Klinis from './resources/js/Pages/RiskRegister/Klinis/Edit.jsx';
 import NonKlinis from './resources/js/Pages/RiskRegister/NonKlinis/Edit.jsx';
 import CreateKlinis from './resources/js/Pages/RiskRegister/Klinis/Create.jsx';
 import CreateNonKlinis from './resources/js/Pages/RiskRegister/NonKlinis/Create.jsx';
 const root=createRoot(document.getElementById('root'));let revision=0;const fixtures=${JSON.stringify(fixtures)};
 window.route=(name,id)=>name?name+(id?'/'+id:''):{current:()=> 'celahPengendalians.index'};
 window.mount=(mode,type='Klinis',empty=false)=>{window.saved=null;window.calls=0;window.currentPeriods=fixtures[type].periods;
 const model={id:10,name:'Celah awal',description:'Keterangan awal',is_active:true};
 const props={...fixtures[type].props,celahPengendalians:empty?[]:[{id:1,name:'Belum tersedia SOP'},{id:2,name:'Pemantauan belum rutin'}]};
 const risk={...fixtures[type].model,celah_pengendalian:'Nilai historis'};const C=mode==='risk-create'?(type==='Klinis'?CreateKlinis:CreateNonKlinis):(type==='Klinis'?Klinis:NonKlinis);
 root.render(<main key={++revision} className="mx-auto max-w-5xl bg-white p-4 dark:bg-slate-950 dark:text-white">{mode==='index'?<Index celahPengendalians={{data:[model],meta:{from:1},filtered:{load:10},attributes:{total:1}}}/>:mode==='edit'?<Edit model={model} setIsOpenEditDialog={()=>{}}/>:<C model={risk} ShouldMap={props} setIsOpenEditDialog={()=>{}}/>}</main>);};`;
 const bundle = await esbuild.build({stdin:{contents:source,loader:'jsx',resolveDir:root},bundle:true,write:false,outdir:dir,jsx:'automatic',alias:{'@':path.join(root,'resources/js')},define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'fixture',setup(b){
  b.onResolve({filter:/^@inertiajs\/react$/},a=>({path:a.path,namespace:'fixture'}));
  b.onResolve({filter:/^@\/Layouts\/App$/},()=>({path:'layout',namespace:'fixture'}));
  b.onLoad({filter:/.*/,namespace:'fixture'},a=>({loader:'jsx',resolveDir:root,contents:a.path==='layout'?'export default function App({children}){return children;}':`import React,{useState}from'react';export const Head=()=>null;export const Link=({children})=><a>{children}</a>;export const router={get(){},delete(){}};export const usePage=()=>({props:{annualPeriods:window.currentPeriods}});export function useForm(initial){const[data,set]=useState(initial),[processing,busy]=useState(false);window.formData=data;const send=(url)=>{window.saved={url,data};window.calls++;busy(true);};return{data,errors:{},processing,setData(k,v){set(old=>typeof k==='function'?k(old):typeof k==='string'?{...old,[k]:v}:k);},reset(){set(initial);},post:send,put:send};}` }));
 }}]});
 const browser=await puppeteer.launch({headless:true});try {
  const page=await browser.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
  await page.setViewport({width:1440,height:1000});await page.setContent('<div id="root"></div>');
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});
  for(const f of bundle.outputFiles.filter(f=>f.path.endsWith('.css')))await page.addStyleTag({content:f.text});await page.addScriptTag({content:bundle.outputFiles.find(f=>f.path.endsWith('.js')).text});
  await page.evaluate(()=>window.mount('index'));await page.waitForSelector('table');assert.match(await page.$eval('table',n=>n.textContent),/Celah awal.*Keterangan awal.*Aktif/s);
  await page.evaluate(()=>[...document.querySelectorAll('button')].find(n=>n.textContent.includes('Tambah Celah Pengendalian')).click());await page.waitForSelector('#celah-name');
  await page.type('#celah-name','Belum tersedia SOP');await page.type('#celah-description','QA master baru');
  await page.screenshot({path:path.join(dir,'master-add.png'),fullPage:true});await page.click('button[type="submit"]');await page.waitForFunction(()=>window.saved!==null);
  assert.equal(await page.evaluate(()=>window.saved.data.name),'Belum tersedia SOP');assert.equal(await page.$eval('button[type="submit"]',n=>n.disabled),true);await page.click('button[type="submit"]');assert.equal(await page.evaluate(()=>window.calls),1);
  await page.evaluate(()=>window.mount('edit'));await page.waitForSelector('#celah-active');await page.$eval('#celah-name',n=>n.select());await page.type('#celah-name','Celah diperbarui');await page.click('#celah-active');
  await page.setViewport({width:390,height:900});await page.evaluate(()=>document.documentElement.classList.add('dark'));await page.screenshot({path:path.join(dir,'master-edit-mobile-dark.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.click('button[type="submit"]');await page.waitForFunction(()=>window.saved!==null);assert.equal(await page.evaluate(()=>window.saved.data.is_active),false);assert.equal(await page.evaluate(()=>window.saved.data.name),'Celah diperbarui');assert.equal(await page.$eval('button[type="submit"]',n=>n.disabled),true);
  const chooseGap=async(label)=>{const h=await page.evaluateHandle(()=>[...document.querySelectorAll('label')].find(n=>n.textContent.trim()==='Celah Pengendalian').parentElement.querySelector('button'));await h.asElement().click();await page.waitForSelector('[role="option"]');const texts=await page.$$eval('[role="option"]',nodes=>nodes.map(n=>n.textContent.trim()));assert.ok(texts.includes(label),texts.join(', '));await page.evaluate(label=>[...document.querySelectorAll('[role="option"]')].find(n=>n.textContent.trim()===label).click(),label);await page.waitForSelector('[role="option"]',{hidden:true});};
  for(const type of ['Klinis','NonKlinis']){
   await page.evaluate(type=>window.mount('risk-create',type),type);await page.waitForSelector('#resiko');await chooseGap('Belum tersedia SOP');assert.equal(await page.evaluate(()=>window.formData.celah_pengendalian),'Belum tersedia SOP');
   await page.evaluate(type=>window.mount('risk',type),type);await page.waitForSelector('#resiko');await chooseGap('Nilai historis (tersimpan)');assert.equal(await page.evaluate(()=>window.formData.celah_pengendalian),'Nilai historis');
   await chooseGap('Belum tersedia SOP');assert.equal(await page.evaluate(()=>window.formData.celah_pengendalian),'Belum tersedia SOP');await chooseGap('Pemantauan belum rutin');assert.equal(await page.evaluate(()=>window.formData.celah_pengendalian),'Pemantauan belum rutin');await chooseGap('Tidak dipilih');assert.equal(await page.evaluate(()=>window.formData.celah_pengendalian),'');
   await page.evaluate(type=>window.mount('risk',type,true),type);await page.waitForSelector('#resiko');assert.match(await page.$eval('body',n=>n.textContent),/Belum ada pilihan aktif/);
  }
  assert.deepEqual(errors,[]);console.log('PASS: master table/add/edit, description, active status, pending-submit guard, mobile dark layout, both risk dropdowns, historical values, change/clear selection, empty-master guidance. Transport uses fixture; no DB writes.');
 } finally {await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});