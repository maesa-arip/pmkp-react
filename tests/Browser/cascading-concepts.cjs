// Local React/Tailwind fixture for the imported workbook concept UI.
const esbuild=require('esbuild'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),puppeteer=require('puppeteer');
async function main(){
 const root=path.resolve(__dirname,'../..'),dir=path.join(root,'storage/app/cascading-template-qa');
 const fixture=JSON.parse(fs.readFileSync(path.join(dir,'concept-fixture.json')));
 const bundle=await esbuild.build({stdin:{resolveDir:root,loader:'jsx',contents:`
 import React from 'react';import {createRoot} from 'react-dom/client';
 import Index from './resources/js/Pages/Kinerja/Index.jsx';
 window.route=(name,params)=>'#'+name;const root=createRoot(document.getElementById('root'));
 window.mount=(closed=false)=>{
 const period={...window.fixture.period,status:closed?'ditutup':'draft'};
 root.render(<main key={String(closed)} className="min-h-screen bg-slate-50 p-4 font-sans dark:bg-slate-950 sm:p-6"><Index period={period} periods={[period]} nodes={{1:[],2:[],3:[],4:[]}} locations={[]} exports={[]} cascadingConcepts={window.fixture.nodes}/></main>);
 };window.mount();
 `},bundle:true,write:false,jsx:'automatic',alias:{'@':path.join(root,'resources/js')},define:{'process.env.NODE_ENV':'"production"'},
 plugins:[{name:'fixture',setup(build){
 build.onResolve({filter:/^@inertiajs\/react$|^@\/Layouts\/App$/},args=>({path:args.path,namespace:'mock'}));
 build.onLoad({filter:/.*/,namespace:'mock'},args=>({resolveDir:root,loader:'js',contents:args.path.includes('Layouts')?'export default function App({children}){return children;}':`
 import {useState} from 'react';export function Head(){return null;}export const router={get(){}};
 export function useForm(initial){const [data,update]=useState(initial);return {data,errors:{},processing:false,setData(k,v){update(old=>typeof k==='string'?{...old,[k]:v}:k);},clearErrors(){},post(){},put(){}};}
 `}));
 }}]});
 const browser=await puppeteer.launch({headless:true});
 try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});
 await page.setViewport({width:1440,height:1000});await page.setContent('<div id="root"></div>');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));
 await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});
 await page.evaluate(f=>window.fixture=f,fixture);await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.waitForSelector('#concept-search');
 const click=async text=>{console.log("Click",text);return page.evaluate(text=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);if(!b)throw new Error('Missing '+text);b.click();},text);};
 const expandSource=async(sheet,cell)=>{
 const name=fixture.nodes.find(n=>n.source_sheet===sheet&&n.source_cell===cell).name;
 await page.evaluate(name=>{const p=[...document.querySelectorAll('li p')].find(p=>p.textContent===name);const b=p.closest('li').querySelector('button[aria-expanded]');if(b.getAttribute('aria-expanded')==='false')b.click();},name);
 };
 await expandSource('direktur','D12');
 await page.waitForFunction(name=>document.body.textContent.includes(name),{},fixture.nodes.find(n=>n.source_sheet==='ASD '&&n.source_cell==='F17').name);
 await expandSource('ASD ','F17');
 await page.waitForFunction(name=>document.body.textContent.includes(name),{},fixture.nodes.find(n=>n.source_sheet==='ASD '&&n.source_cell==='C31').name);

 await page.evaluate(name=>[...document.querySelectorAll('li p')].find(p=>p.textContent===name).scrollIntoView({block:'center'}),fixture.nodes.find(n=>n.source_sheet==='ASD '&&n.source_cell==='F17').name);
 await page.screenshot({path:path.join(dir,'concept-tree-desktop.png')});
 await click('Hierarki indikator');await page.waitForSelector('tbody tr');
 assert.equal(await page.$$eval('tbody tr',rows=>rows.length),25);
 await click('Indikator mutu · 325');await page.waitForFunction(()=>document.body.textContent.includes('325 data · halaman 1 / 13'));
 await click('Berikutnya');await page.waitForFunction(()=>document.body.textContent.includes('halaman 2 / 13'));
 await click('Hapus filter');await page.type('#concept-search','Indeks kepuasan masyarakat');
 await page.waitForFunction(()=>document.querySelectorAll('tbody tr').length===3);
 await click('Hapus filter');await page.click('#concept-office');await page.waitForSelector('[role="option"]');
 const office=fixture.nodes.find(n=>n.kind==='indikator_mutu').office;
 await page.evaluate(office=>{const b=[...document.querySelectorAll('[role="option"]')].find(n=>n.textContent.trim()===office);b.click();},office);
 const count=fixture.nodes.filter(n=>n.office===office).length;
 await page.waitForFunction(count=>document.body.textContent.includes(count+' data · halaman'),{},count);
 await page.waitForSelector('[role="option"]',{hidden:true});await page.evaluate(()=>document.querySelector('tbody button').click());await page.waitForSelector('[role="dialog"] textarea');
 assert.ok((await page.$eval('#concept-name',e=>e.value)).length>0);
 await page.screenshot({path:path.join(dir,'concept-edit.png')});await click('Batal');await click('Hapus filter');await click('Indikator mutu · 325');
 for(const width of [1440,390]){
 await page.setViewport({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'page overflow '+width);
 await page.screenshot({path:path.join(dir,'concept-table-'+width+'.png')});
 }
 await page.evaluate(()=>document.documentElement.classList.add('dark'));await page.screenshot({path:path.join(dir,'concept-table-dark.png')});
 await page.evaluate(()=>window.mount(true));await page.waitForSelector('#concept-search');await click('Hierarki indikator');await page.waitForSelector('tbody tr');
 assert.equal(await page.$$eval('tbody button',n=>n.length),0);assert.deepEqual(errors,[]);
 console.log('PASS: full page, tree, quality filter, search, office, pagination, edit modal, closed period, desktop/mobile and dark mode.');
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
