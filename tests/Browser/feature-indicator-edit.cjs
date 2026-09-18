const esbuild = require('esbuild'), fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), puppeteer = require('puppeteer');
async function main() {
    const root = path.resolve(__dirname, '../..');
    const bundle = await esbuild.build({ stdin: { resolveDir: root, loader: 'jsx', contents: `
        import React, {useState} from 'react'; import {createRoot} from 'react-dom/client';
        import Index from './resources/js/Pages/Kinerja/Index.jsx';
        import Form from './resources/js/Pages/MUTU/MutuIndikator/Form.jsx';
        window.route=(name,params)=>JSON.stringify({name,params});
        const periods=[{id:1,tahun:2027,status:'aktif'}, {id:2,tahun:2028,status:'aktif'}];
        const nodes={1:[{id:11,name:'IKU Direktur',is_active:1}],2:[{id:21,name:'Kegiatan Wadir A',is_active:1,indikator_fitur1_id:11},{id:22,name:'Kegiatan tanpa indikator',is_active:1}],3:[{id:31,name:'Kegiatan Kabag A',is_active:1,indikator_fitur2_id:21}],4:[{id:41,name:'Mutu unit A',is_active:1,periode_kinerja_id:1,indikator_fitur3_id:31}]};
        const performance=[{id:51,name:'Indikator Wadir pertama',indikator_fitur2_id:21,is_active:1},{id:52,name:'Indikator Wadir kedua',indikator_fitur2_id:21,is_active:1},{id:53,name:'Indikator Kabag',indikator_fitur3_id:31,is_active:1}];
        const maps={Periods:periods,tahun:2027,IndikatorFitur3:nodes[3],IndikatorFitur4:[...nodes[4],{id:42,name:'Mutu tahun berikutnya',is_active:1,periode_kinerja_id:2,indikator_fitur3_id:32}],IndikatorBaru:[{id:0,name:'Tidak'},{id:1,name:'Ya'}],MutuKategori:[{id:1,name:'Mutu unit'}],Operator:[{id:'=',name:'='}],Penyebut:[{id:'%',name:'%'}]};
        function Mutu(){const [data,set]=useState({periode_kinerja_id:'',indikator_fitur3_id:'',indikator_fitur4_id:'',IndikatorBaru:0,mutu_kategori_id:'',operator:'',penyebut:'',num_name:'',denum_name:'',standar:''});window.data=data;return <form className="mx-auto max-w-4xl" onSubmit={e=>e.preventDefault()}><Form data={data} setData={(key,value)=>set(old=>typeof key==='string'?{...old,[key]:value}:key)} errors={{}} ShouldMap={maps} submit="Simpan" closeButton={()=>{}} /></form>;}
        const root=createRoot(document.getElementById('root'));
        window.mount=(mode='kinerja',closed=false)=>root.render(<main key={mode+closed} className="min-h-screen min-w-0 bg-slate-50 p-4 font-sans dark:bg-slate-950">{mode==='mutu'?<Mutu/>:<Index periods={periods} period={{...periods[0],feature_schema_version:2,status:closed?'ditutup':'aktif'}} nodes={nodes} performanceIndicators={performance} locations={[]} exports={[]}/>}</main>);
        window.mount();
    ` }, bundle:true, write:false, jsx:'automatic', alias:{'@':path.join(root,'resources/js')}, define:{'process.env.NODE_ENV':'"production"'}, plugins:[{name:'fixture',setup(build){
        build.onResolve({filter:/^@inertiajs\/react$|^@\/Layouts\/App$/},args=>({path:args.path,namespace:'mock'}));
        build.onLoad({filter:/.*/,namespace:'mock'},args=>({resolveDir:root,loader:'js',contents:args.path.includes('Layouts')?'export default function App({children}){return children;}':`import {useState} from 'react';export function Head(){return null;}export const router={get(){}};export function useForm(initial){const [data,set]=useState(initial);const submit=(url,options)=>{window.saved={url:JSON.parse(url),data};options?.onSuccess?.();};return {data,errors:{},processing:false,setData(key,value){set(old=>typeof key==='string'?{...old,[key]:value}:key);},clearErrors(){},put:submit,post:submit,delete:submit};}`}));
    }}] });
    const browser=await puppeteer.launch({headless:true});
    try {
        const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
        await page.setViewport({width:1440,height:1000});await page.setContent('<div id="root"></div>');
        const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});await page.addScriptTag({content:bundle.outputFiles[0].text});
        const clickText=async(text)=>{await page.waitForFunction(t=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===t),{},text);await page.evaluate(t=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===t).click(),text);};
        const chooseLevel=async(level)=>{await page.evaluate(level=>[...document.querySelectorAll('aside button')].find(b=>b.textContent.includes('(fitur '+level+')')).click(),level);};
        const open=async(name)=>{await page.click('[aria-label="Lihat indikator '+name+'"]');await page.waitForSelector('[role="dialog"]');};
        await clickText('Fitur 1–4');await chooseLevel(2);
        assert.equal(await page.$eval('[aria-label="Lihat indikator Kegiatan Wadir A"]',n=>n.textContent),'2 indikator kinerja');
        await open('Kegiatan Wadir A');let text=await page.$eval('[role="dialog"]',n=>n.textContent);assert.ok(text.includes('Indikator Wadir pertama')&&text.includes('Indikator Wadir kedua')&&!text.includes('Indikator Kabag'));
        await page.click('[aria-label="Edit indikator Indikator Wadir kedua"]');await page.waitForSelector('#feature-indicator-name');
        await page.$eval('#feature-indicator-name',n=>n.select());await page.type('#feature-indicator-name','Perubahan Wadir');await clickText('Simpan indikator');
        assert.deepEqual(await page.evaluate(()=>window.saved),{url:{name:'kinerja.performance.update',params:52},data:{periode_kinerja_id:1,level:2,activity_id:21,name:'Perubahan Wadir',kode_cascading:''}});
        await clickText('Tutup');await open('Kegiatan tanpa indikator');assert.ok((await page.$eval('[role="dialog"]',n=>n.textContent)).includes('Belum ada indikator'));await clickText('Tutup');
        await chooseLevel(3);await open('Kegiatan Kabag A');assert.equal(await page.$$eval('[role="dialog"] li',n=>n.length),1);await page.click('[aria-label="Edit indikator Indikator Kabag"]');await page.waitForSelector('#feature-indicator-name');await clickText('Simpan indikator');assert.equal(await page.evaluate(()=>window.saved.data.activity_id),31);await clickText('Tutup');
        for (const [level,name,activityId,indicatorId] of [[2,'Kegiatan Wadir A',21,51],[3,'Kegiatan Kabag A',31,53]]) {
            await chooseLevel(level);await open(name);await clickText('Tambah indikator kinerja');await page.waitForSelector('#feature-indicator-name');
            await page.type('#feature-indicator-name','Indikator baru fitur '+level);await clickText('Simpan indikator');
            assert.deepEqual(await page.evaluate(()=>window.saved),{url:{name:'kinerja.performance.store'},data:{periode_kinerja_id:1,level,activity_id:activityId,name:'Indikator baru fitur '+level,kode_cascading:''}});
            const indicatorName=level===2?'Indikator Wadir pertama':'Indikator Kabag';
            await page.click('[aria-label="Hapus indikator '+indicatorName+'"]');await page.waitForFunction(()=>[...document.querySelectorAll('[role="dialog"]')].some(d=>d.textContent.includes('Hapus indikator kinerja')));
            await clickText('Batal');await page.waitForFunction(()=>document.querySelectorAll('[role="dialog"]').length===1);
            assert.equal(await page.evaluate(()=>window.saved.url.name),'kinerja.performance.store');
            await page.click('[aria-label="Hapus indikator '+indicatorName+'"]');await clickText('Hapus indikator');
            assert.deepEqual(await page.evaluate(()=>window.saved),{url:{name:'kinerja.performance.destroy',params:indicatorId},data:{periode_kinerja_id:1,level,activity_id:activityId}});
            await page.waitForFunction(()=>document.querySelectorAll('[role="dialog"]').length===1);await clickText('Tutup');
        }
        await chooseLevel(1);assert.equal(await page.$('[aria-label="Lihat indikator IKU Direktur"]'),null);await page.click('[aria-label="Edit IKU Direktur"]');await page.waitForSelector('[role="dialog"] textarea');assert.ok((await page.$$eval('[role="dialog"] textarea',nodes=>nodes.map(n=>n.value))).includes('IKU Direktur'));await clickText('Batal');
        await chooseLevel(4);await open('Mutu unit A');assert.equal(await page.$$eval('[role="dialog"] li',n=>n.length),1);await page.click('[aria-label="Edit indikator Mutu unit A"]');await page.waitForSelector('[role="dialog"] textarea');assert.equal(await page.$eval('[role="dialog"] textarea',n=>n.value),'Mutu unit A');await clickText('Batal');
        await page.setViewport({width:390,height:900});await chooseLevel(2);await open('Kegiatan Wadir A');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        const dir=path.join(root,'storage/app/cascading-template-qa');fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,'feature-indicator-list-mobile.png'),fullPage:true});await clickText('Tutup');
        await page.evaluate(()=>window.mount('kinerja',true));await clickText('Fitur 1–4');await chooseLevel(2);await open('Kegiatan Wadir A');assert.equal(await page.$$eval('[role="dialog"] button[aria-label^="Edit indikator"]',n=>n.length),0);await clickText('Tutup');
        await page.evaluate(()=>window.mount('mutu'));await page.waitForSelector('#mutu-year');assert.equal(await page.$eval('#mutu-year',n=>n.value),'2027');
        const options=async()=>{await page.$$eval('[role="combobox"]',nodes=>nodes[1].parentElement.querySelector('button').click());await page.waitForSelector('[role="option"]');return page.$$eval('[role="option"]',nodes=>nodes.map(n=>n.textContent.trim()));};
        assert.deepEqual(await options(),['Mutu unit A']);await page.click('[role="option"]');await page.waitForFunction(()=>window.data.indikator_fitur4_id===41);assert.equal(await page.evaluate(()=>window.data.indikator_fitur3_id),31);
        await page.select('#mutu-year','2028');await page.waitForFunction(()=>window.data.periode_kinerja_id===2);assert.equal(await page.evaluate(()=>window.data.indikator_fitur4_id),'');assert.equal(await page.evaluate(()=>window.data.indikator_fitur3_id),'');assert.deepEqual(await options(),['Mutu tahun berikutnya']);await page.click('[role="option"]');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.ok((await page.$eval('main',n=>n.textContent)).includes('Formula & Standar Pengukuran'));await page.screenshot({path:path.join(dir,'mutu-restored-mobile.png'),fullPage:true});
        assert.deepEqual(errors,[]);console.log('PASS: counts and edit actions for features 1–4, activity isolation, empty/closed states, year filtering and automatic parent, mobile overflow.');
    } finally {await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
