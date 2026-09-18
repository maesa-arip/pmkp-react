
const esbuild=require('esbuild'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),puppeteer=require('puppeteer');
async function main(){
 const root=path.resolve(__dirname,'../..'),dir=path.join(root,'storage/app/cascading-template-qa');
 const bundle=await esbuild.build({stdin:{resolveDir:root,loader:'jsx',contents:`
 import React,{useState} from 'react';import {createRoot} from 'react-dom/client';
 import Form from './resources/js/Pages/MUTU/MutuIndikator/Form.jsx';
 import Performance from './resources/js/Pages/Kinerja/Performance.jsx';
 window.route=name=>'#'+name;
 const periods=[{id:1,tahun:2027,status:'aktif'},{id:2,tahun:2028,status:'draft'}];
 const activities=[{id:31,periode_kinerja_id:1,is_active:1,name:'Perencanaan dan pelaporan yang akuntabel',jabatan:'KABAG PERENCANAAN',level:3},{id:32,periode_kinerja_id:1,is_active:1,name:'Peningkatan kompetensi sumber daya',jabatan:'KABAG SDM',level:3},{id:33,periode_kinerja_id:2,is_active:1,name:'Kegiatan tahun 2028',level:3},{id:21,periode_kinerja_id:1,is_active:1,name:'Kinerja dan tata kelola administrasi',jabatan:'WADIR ASD',level:2}];
 const options={Periods:periods,tahun:2027,IndikatorFitur3:activities.filter(a=>a.level===3),IndikatorFitur4:[{id:41,periode_kinerja_id:1,indikator_fitur3_id:31,is_active:1,name:'Ketepatan dokumen perencanaan'},{id:42,periode_kinerja_id:1,indikator_fitur3_id:32,is_active:1,name:'Kompetensi pegawai'}],IndikatorBaru:[{id:0,name:'Tidak'},{id:1,name:'Ya'}],MutuKategori:[{id:1,name:'Indikator mutu unit'}],Operator:[{id:'≥',name:'≥'}],Penyebut:[{id:'%',name:'%'}]};
 function Mutu(){const [data,set]=useState({periode_kinerja_id:1,indikator_fitur3_id:'',indikator_fitur4_id:'',IndikatorBaru:0});window.data=data;return <form className="mx-auto max-w-4xl" onSubmit={e=>e.preventDefault()}><Form data={data} setData={(k,v)=>set(old=>typeof k==='string'?{...old,[k]:v}:k)} errors={{}} ShouldMap={options} submit="Simpan" closeButton={()=>{}}/></form>;}
 const root=createRoot(document.getElementById('root'));
 window.mount=kind=>root.render(<div className="min-h-screen min-w-0 bg-slate-50 p-4 font-sans dark:bg-slate-950">{kind==='mutu'?<Mutu/>:<Performance period={periods[0]} periods={periods} activities={activities.filter(a=>a.periode_kinerja_id===1)} indicators={[{id:1,indikator_fitur2_id:21,name:'Persentase penyelenggaraan SPIP',jabatan:'WADIR ASD',kode_cascading:'1.1'}]}/>}</div>);window.mount('mutu');
`},bundle:true,write:false,jsx:'automatic',alias:{'@':path.join(root,'resources/js')},define:{'process.env.NODE_ENV':'"production"'},
 plugins:[{name:'fixture',setup(build){build.onResolve({filter:/^@inertiajs\/react$|^@\/Layouts\/App$/},args=>({path:args.path,namespace:'mock'}));build.onLoad({filter:/.*/,namespace:'mock'},args=>({resolveDir:root,loader:'js',contents:args.path.includes('Layouts')?'export default function App({children}){return children;}':"import {useState} from 'react';export function Head(){return null;}export const router={get(){}};export function useForm(initial){const [data,set]=useState(initial);return {data,errors:{},processing:false,setData(k,v){set(old=>typeof k==='string'?{...old,[k]:v}:k);},clearErrors(){},post(){},put(){}};}"}));}}]});
 const browser=await puppeteer.launch({headless:true});
 try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width:1440,height:1100});await page.setContent('<div id="root"></div>');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});await page.addScriptTag({content:bundle.outputFiles[0].text});
 const choose=async(selector,text)=>{await page.click(selector);await page.waitForSelector('[role="option"]');await page.evaluate(t=>{const b=[...document.querySelectorAll('[role="option"]')].find(b=>b.textContent.trim()===t);if(!b)throw new Error('Missing option '+t);b.click();},text);await page.waitForSelector('[role="option"]',{hidden:true});};
 assert.equal(await page.$eval('#mutu-year',n=>n.value),'2027');
 await page.$$eval('[role="combobox"]',nodes=>nodes[1].parentElement.querySelector('button').click());await page.waitForSelector('[role="option"]');
 const opts=await page.$$eval('[role="option"]',nodes=>nodes.map(n=>n.textContent.trim()));
 assert.deepEqual(opts,['Ketepatan dokumen perencanaan','Kompetensi pegawai']);
 await page.click('[role="option"]');await page.waitForFunction(()=>window.data.indikator_fitur4_id===41);
 assert.equal(await page.evaluate(()=>window.data.indikator_fitur3_id),31);
 await page.screenshot({path:path.join(dir,'features-mutu-desktop.png'),fullPage:true});
 await page.setViewport({width:390,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:path.join(dir,'features-mutu-mobile.png'),fullPage:true});
 await page.select('#mutu-year','2028');await page.waitForFunction(()=>window.data.periode_kinerja_id===2);
 assert.equal(await page.evaluate(()=>window.data.indikator_fitur4_id),'');
 assert.equal(await page.evaluate(()=>window.data.indikator_fitur3_id),'');
 await page.evaluate(()=>window.mount('performance'));await page.waitForSelector('#performance-search');
 await page.screenshot({path:path.join(dir,'features-performance-mobile.png'),fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Tambah indikator kinerja').click());await page.waitForSelector('[role="dialog"]');await page.type('#performance-name','Indikator kinerja pengujian');
 await page.setViewport({width:1440,height:1000});await page.screenshot({path:path.join(dir,'features-performance-form.png')});assert.deepEqual(errors,[]);
 console.log('PASS: restored Mutu form, year options, automatic parent, resets, performance modal and mobile overflow.');
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
