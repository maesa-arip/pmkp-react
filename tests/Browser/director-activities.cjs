const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');

async function main() {
    const root = path.resolve(__dirname, '../..');
    const bundle = await esbuild.build({ stdin: { resolveDir: root, loader: 'jsx', contents: `
        import React from 'react'; import {createRoot} from 'react-dom/client';
        import Index from './resources/js/Pages/Kinerja/Index';
        window.route=(name,params)=>JSON.stringify({name,params});
        const nodes=[{id:1,kind:'iku',name:'IKU pelayanan',is_active:1},{id:2,kind:'iku',name:'IKU tata kelola',is_active:1},
            {id:3,kind:'kegiatan',tier:'direktur',name:'Kegiatan Direktur A',code:'1.1',parent_id:1,is_active:1},
            {id:4,kind:'indikator_kinerja',tier:'direktur',name:'Indikator Direktur A',code:'1.1.1',parent_id:3,is_active:1}];
        const root=createRoot(document.getElementById('root'));
        window.mount=(closed=false)=>root.render(<main key={String(closed)} className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950"><Index period={{id:356,tahun:2026,feature_schema_version:2,status:closed?'ditutup':'aktif'}} periods={[{id:356,tahun:2026,status:'aktif'}]} nodes={{1:nodes.filter(n=>n.kind==='iku'),2:[],3:[],4:[]}} cascadingConcepts={nodes} locations={[]} exports={[]}/></main>);
        window.mount();
    ` }, bundle:true, write:false, jsx:'automatic', alias:{'@':path.join(root,'resources/js')}, define:{'process.env.NODE_ENV':'"production"'}, plugins:[{name:'fixture',setup(build){
        build.onResolve({filter:/^@inertiajs\/react$|^@\/Layouts\/App$/},args=>({path:args.path,namespace:'mock'}));
        build.onLoad({filter:/.*/,namespace:'mock'},args=>({resolveDir:root,loader:'js',contents:args.path.includes('Layouts')?'export default function App({children}){return children;}':`import {useState} from 'react';export function Head(){return null;}export const router={get(){}};export function useForm(initial){const [data,set]=useState(initial);const submit=(url,options)=>{window.saved={url:JSON.parse(url),data};options?.onSuccess?.();};return {data,errors:{},processing:false,setData(key,value){set(old=>typeof key==='string'?{...old,[key]:value}:key);},clearErrors(){},put:submit,post:submit};}`}));
    }}] });
    const browser=await puppeteer.launch({headless:true});
    try {
        const page=await browser.newPage(), errors=[];
        page.on('pageerror',error=>{errors.push(error.message);console.error(error.message);});
        await page.setViewport({width:1440,height:1000});
        await page.setContent('<div id="root"></div>');
        const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));
        await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});
        await page.addScriptTag({content:bundle.outputFiles[0].text});
        const clickText=async text=>{await page.waitForFunction(t=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===t),{},text).catch(error=>{throw new Error('Button '+text+': '+error.message);});await page.evaluate(t=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===t).click(),text);};
        await clickText('Fitur 1–4');
        assert.equal(await page.$eval('aside button[aria-pressed="true"]',n=>n.textContent.includes('IKU Direktur (fitur 1)')),true);
        await clickText('Tambah kegiatan Direktur');
        await page.waitForSelector('#director-name');
        assert.equal(await page.evaluate(()=>[...document.querySelectorAll('[role="dialog"] button')].find(n=>n.textContent.trim()==='Simpan').disabled),true);
        await page.click('#director-parent');await page.waitForSelector('[role="option"]');
        await page.evaluate(()=>[...document.querySelectorAll('[role="option"]')].find(n=>n.textContent.includes('IKU tata kelola')).click());
        await page.waitForFunction(()=>!document.querySelector('[role="option"]'));
        await page.type('#director-name','Kegiatan baru dari formulir');await page.type('#director-code','D2');await clickText('Simpan');
        assert.deepEqual(await page.evaluate(()=>window.saved),{url:{name:'kinerja.director.store',params:356},data:{kind:'kegiatan',parent_id:2,name:'Kegiatan baru dari formulir',code:'D2'}});
        await page.waitForFunction(()=>!document.querySelector('[role="dialog"]'));
        await page.click('[aria-label="Edit kegiatan Kegiatan Direktur A"]');await page.waitForSelector('#director-name');
        assert.equal(await page.$eval('#director-name',n=>n.value),'Kegiatan Direktur A');
        await page.$eval('#director-name',n=>n.select());await page.type('#director-name','Kegiatan diperbarui');await clickText('Simpan');
        assert.equal(await page.evaluate(()=>window.saved.url.name),'kinerja.director.update');assert.equal(await page.evaluate(()=>window.saved.data.parent_id),1);
        await page.waitForFunction(()=>!document.querySelector('[role="dialog"]'));
        await page.click('[aria-label="Tambah indikator untuk Kegiatan Direktur A"]');await page.waitForSelector('#director-name');await page.type('#director-name','Indikator baru');await clickText('Simpan');
        assert.deepEqual(await page.evaluate(()=>window.saved.data),{kind:'indikator_kinerja',parent_id:3,name:'Indikator baru',code:''});
        await page.waitForFunction(()=>!document.querySelector('[role="dialog"]'));
        await page.click('[aria-label="Edit indikator Direktur Indikator Direktur A"]');await page.waitForSelector('#director-name');await page.$eval('#director-name',n=>n.select());await page.type('#director-name','Indikator diperbarui');await clickText('Simpan');
        assert.deepEqual(await page.evaluate(()=>window.saved.url.params),[356,4]);
        await page.waitForFunction(()=>!document.querySelector('[role="dialog"]'));
        const dir=path.join(root,'storage/app/cascading-template-qa');
        await page.screenshot({path:path.join(dir,'director-activities-desktop.png'),fullPage:true});
        await page.setViewport({width:390,height:844});await page.screenshot({path:path.join(dir,'director-activities-mobile.png'),fullPage:true});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        await clickText('Tambah kegiatan Direktur');await page.waitForSelector('#director-name');
        await page.screenshot({path:path.join(dir,'director-form-mobile.png'),fullPage:true});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await clickText('Batal');
        await page.evaluate(()=>window.mount(true));await page.waitForFunction(()=>[...document.querySelectorAll('nav button')].some(n=>n.textContent.trim()==='Bagan Cascading'&&n.getAttribute('aria-pressed')==='true'));await clickText('Fitur 1–4');await page.waitForFunction(()=>document.body.textContent.includes('Periode sudah ditutup'));
        assert.equal(await page.$$eval('button',nodes=>nodes.filter(n=>/Tambah|Edit/.test(n.textContent)).length),0);
        assert.deepEqual(errors,[]);
        console.log('PASS: Admin Fitur 1 navigation, Director activity and indicator add/edit, parent selection, closed period, desktop/mobile layout.');
    } finally {await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
