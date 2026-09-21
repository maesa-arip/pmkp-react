const esbuild=require('esbuild'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),puppeteer=require('puppeteer');
async function main(){
const root=path.resolve(__dirname,'../..'),base=path.join(root,'storage/app/cascading-template-qa'),dir=fs.readFileSync(path.join(base,'latest-annual-run.txt'),'utf8').trim();
const fixtures=JSON.parse(fs.readFileSync(path.join(dir,'page-fixtures.json'),'utf8'));
const src="import React from 'react';import {createRoot} from 'react-dom/client';import Index from './resources/js/Pages/Kinerja/Index.jsx';window.route=n=>'#'+n;const root=createRoot(document.getElementById('root'));window.mount=year=>root.render(<main className='min-h-screen min-w-0 bg-slate-50 p-4 font-sans dark:bg-slate-950 sm:p-6'><Index key={year} {...window.fixtures[year]}/></main>);window.mount(2024);";
const bundle=await esbuild.build({stdin:{resolveDir:root,loader:'jsx',contents:src},bundle:true,write:false,jsx:'automatic',alias:{'@':path.join(root,'resources/js')},define:{'process.env.NODE_ENV':'"production"'},
plugins:[{name:'fixture',setup(b){b.onResolve({filter:/^@inertiajs\/react$|^@\/Layouts\/App$/},a=>({path:a.path,namespace:'mock'}));b.onLoad({filter:/.*/,namespace:'mock'},a=>({resolveDir:root,loader:'js',contents:a.path.includes('Layouts')?'export default function App({children}){return children;}':"import {useState} from 'react';export function Head(){return null;}export const router={get(){}};export function useForm(initial){const [data,update]=useState(initial);return {data,errors:{},processing:false,setData(k,v){update(old=>typeof k==='string'?{...old,[k]:v}:k);},clearErrors(){},post(){},put(){}};}"}));}}]});
const browser=await puppeteer.launch({headless:true});try{
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width:1440,height:1000});await page.setContent('<div id="root"></div>');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});await page.evaluate(f=>window.fixtures=f,fixtures);await page.addScriptTag({content:bundle.outputFiles[0].text});
const click=async t=>{await page.waitForFunction(t=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim().startsWith(t)),{},t);await page.evaluate(t=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(t)).click(),t);};
for(const year of [2024,2025,2026]){
if(year!==2024)await page.evaluate(y=>window.mount(y),year);
await click('Fitur 1–4');await click(year===2026?'Kegiatan Wadir (fitur 2)':'Program (fitur 2)');
await page.waitForSelector('tbody [aria-label^="Lihat indikator"]');await page.evaluate(()=>document.querySelector('tbody [aria-label^="Lihat indikator"]').click());await page.waitForSelector('[role="dialog"]');
assert.ok(await page.$$eval('[role="dialog"] li',n=>n.length)>0,'Indicator dialog empty '+year);
if(year!==2026){assert.ok(await page.$eval('[role="dialog"]',n=>n.textContent.includes('data historis')));assert.equal(await page.$$eval('[role="dialog"] [aria-label^="Edit indikator"]',n=>n.length),0);}
await page.screenshot({path:path.join(dir,'page-'+year+'.png')});await click('Tutup');
}
await page.setViewport({width:390,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
assert.deepEqual(errors,[]);console.log('PASS: actual 2024/2025/2026 fixtures, historical labels and closed controls, linked 2026 performance indicators, responsive page.');
}finally{await browser.close();}}
main().catch(e=>{console.error(e);process.exitCode=1;});
