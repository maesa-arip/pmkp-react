const esbuild = require('esbuild'), fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), puppeteer = require('puppeteer');
async function main() {
    const root = path.resolve(__dirname, '../..');
    const bundle = await esbuild.build({ stdin: { resolveDir: root, loader: 'jsx', contents: `
        import React, {useState} from 'react'; import {createRoot} from 'react-dom/client';
        import Index from './resources/js/Pages/Kinerja/Index.jsx';
        import Form from './resources/js/Pages/MUTU/MutuIndikator/Form.jsx';
        window.route=(name,params)=>JSON.stringify({name,params});
        const periods=[{id:1,tahun:2027,status:'aktif'}, {id:2,tahun:2028,status:'aktif'}];
        const nodes={sasaran:[{id:101,name:'Sasaran layanan bermutu',is_active:1}],1:[{id:11,name:'IKU Direktur',jabatan:'DIREKTUR',kode_cascading:'1.1',is_active:1,cascading_color:'#123ABC',sasaran_strategis_id:101},{id:12,name:'IKU Bawaan',jabatan:'DIREKTUR',kode_cascading:'1.2',is_active:1}],2:[{id:21,name:'Kegiatan Wadir A',is_active:1,indikator_fitur1_id:11},{id:22,name:'Kegiatan tanpa indikator',is_active:1}],3:[{id:31,name:'Kegiatan Kabag A',is_active:1,indikator_fitur2_id:21}],4:[{id:41,name:'Mutu unit A',is_active:1,periode_kinerja_id:1,indikator_fitur3_id:31}]};
        const performance=[{id:51,name:'Indikator Wadir pertama',indikator_fitur2_id:21,is_active:1},{id:52,name:'Indikator Wadir kedua',indikator_fitur2_id:21,is_active:1},{id:53,name:'Indikator Kabag',indikator_fitur3_id:31,is_active:1}];
        const maps={Periods:periods,tahun:2027,IndikatorFitur3:nodes[3],IndikatorFitur4:[...nodes[4],{id:42,name:'Mutu tahun berikutnya',is_active:1,periode_kinerja_id:2,indikator_fitur3_id:32}],IndikatorBaru:[{id:0,name:'Tidak'},{id:1,name:'Ya'}],MutuKategori:[{id:1,name:'Mutu unit'}],Operator:[{id:'=',name:'='}],Penyebut:[{id:'%',name:'%'}]};
        function Mutu(){const [data,set]=useState({periode_kinerja_id:'',indikator_fitur3_id:'',indikator_fitur4_id:'',IndikatorBaru:0,mutu_kategori_id:'',operator:'',penyebut:'',num_name:'',denum_name:'',standar:''});window.data=data;return <form className="mx-auto max-w-4xl" onSubmit={e=>e.preventDefault()}><Form data={data} setData={(key,value)=>set(old=>typeof key==='string'?{...old,[key]:value}:key)} errors={{}} ShouldMap={maps} submit="Simpan" closeButton={()=>{}} /></form>;}
        const root=createRoot(document.getElementById('root'));
        window.mount=(mode='kinerja',closed=false)=>root.render(<main key={mode+closed} className="min-h-screen min-w-0 bg-slate-50 p-4 font-sans dark:bg-slate-950">{mode==='mutu'?<Mutu/>:<Index periods={periods} period={{...periods[0],feature_schema_version:2,status:closed?'ditutup':'aktif'}} nodes={nodes} cascadingConcepts={[{id:100,kind:'tujuan_strategis',name:'Tujuan pelayanan kesehatan',parent_id:null,office:'Direktur',source_sheet:'direktur',source_cell:'F3'},{id:200,kind:'program',name:'Program pelayanan daerah',parent_id:100,office:'Direktur',source_sheet:'direktur',source_cell:'F5'},{id:300,kind:'sasaran_strategis',name:'Sasaran layanan bermutu',parent_id:100,legacy_table:'sasaran_strategis',legacy_id:101,office:'Direktur',source_sheet:'direktur',source_cell:'D8'},...['grey','yellow'].map((iku_branch,i)=>({id:i+1,kind:'iku',legacy_table:'indikator_fitur1s',legacy_id:i+11,iku_branch,name:'IKU '+iku_branch,tier:'direktur',office:'Direktur',source_sheet:'direktur',source_cell:'D'+(i+12)}))]} performanceIndicators={performance} locations={[]} exports={[]}/>}</main>);
        window.mount();
    ` }, bundle:true, write:false, jsx:'automatic', alias:{'@':path.join(root,'resources/js')}, define:{'process.env.NODE_ENV':'"production"'}, plugins:[{name:'fixture',setup(build){
        build.onResolve({filter:/^@inertiajs\/react$|^@\/Layouts\/App$/},args=>({path:args.path,namespace:'mock'}));
        build.onLoad({filter:/.*/,namespace:'mock'},args=>({resolveDir:root,loader:'js',contents:args.path.includes('Layouts')?'export default function App({children}){return children;}':`import {useState} from 'react';export function Head(){return null;}export const router={get(){}};export function useForm(initial){const [data,set]=useState(initial);const submit=(url,options)=>{window.saved={url:JSON.parse(url),data};options?.onSuccess?.();};return {data,errors:{},processing:false,setData(key,value){set(old=>typeof key==='string'?{...old,[key]:value}:key);},clearErrors(){},put:submit,post:submit};}`}));
    }}] });
    const browser=await puppeteer.launch({headless:true});
    try {
        const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
        await page.setViewport({width:1440,height:1000});await page.setContent('<div id="root"></div>');
        const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});await page.addScriptTag({content:bundle.outputFiles[0].text});
        const clickText=async(text)=>{await page.waitForFunction(t=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===t),{},text);await page.evaluate(t=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===t).click(),text);};
        const chooseLevel=async(level)=>{await page.evaluate(level=>[...document.querySelectorAll('aside button')].find(b=>b.textContent.includes('(fitur '+level+')')).click(),level);};
        const open=async(name)=>{await page.click('[aria-label="Lihat indikator '+name+'"]');await page.waitForSelector('[role="dialog"]');};
        await clickText('Fitur 1–4');
        assert.deepEqual(await page.$$eval('aside button',buttons=>buttons.map(b=>b.querySelector('span').textContent)),['Tujuan','Program','Sasaran Strategis','IKU Direktur (fitur 1)','Kegiatan Wadir (fitur 2)','Kegiatan Kabag/Kabid (fitur 3)','Indikator mutu (fitur 4)']);
        assert.equal(await page.$('[aria-label="Lihat indikator IKU Direktur"]'),null);
        for (const [label,name,id] of [['Tujuan','Tujuan pelayanan kesehatan',100],['Program','Program pelayanan daerah',200],['Sasaran Strategis','Sasaran layanan bermutu',300]]) {
            await page.evaluate(label=>[...document.querySelectorAll('aside button')].find(b=>b.querySelector('span').textContent===label).click(),label);
            await page.waitForFunction(name=>document.querySelector('tbody')?.textContent.includes(name),{},name);
            assert.equal(await page.$$eval('tbody tr',rows=>rows.length),1);
            await page.click('[aria-label="Edit '+name+'"]');await page.waitForSelector('#concept-name');
            assert.equal(await page.$eval('#concept-name',input=>input.value),name);
            await page.$eval('[role="dialog"] form',form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
            await page.waitForFunction(id=>window.saved?.url.params[1]===id,{},id);
            assert.equal(await page.evaluate(()=>window.saved.url.name),'kinerja.concepts.update');
        }
        await chooseLevel(1);
        const rowStyle=()=>page.$eval('tbody tr',row=>({bg:getComputedStyle(row).backgroundColor,text:getComputedStyle(row).color}));
        assert.deepEqual(await rowStyle(),{bg:'rgb(18, 58, 188)',text:'rgb(255, 255, 255)'});
        const screenshotDir=path.join(root,'storage/app/cascading-template-qa');fs.mkdirSync(screenshotDir,{recursive:true});
        await (await page.$('table')).screenshot({path:path.join(screenshotDir,'iku-blocks-light.png')});
        await page.evaluate(()=>document.documentElement.classList.add('dark'));
        assert.deepEqual(await rowStyle(),{bg:'rgb(18, 58, 188)',text:'rgb(255, 255, 255)'});
        await (await page.$('table')).screenshot({path:path.join(screenshotDir,'iku-blocks-dark.png')});
        await page.click('[aria-label="Edit IKU Direktur"]');await page.waitForSelector('#iku-color');
        assert.equal(await page.$eval('#iku-color',input=>input.value),'#123abc');
        assert.deepEqual((await page.$$eval('[role="dialog"] label',labels=>labels.map(l=>l.textContent))).slice(0,4),['Tujuan','Program','Sasaran Strategis','Nama indikator kinerja utama *']);
        assert.equal(await page.$eval('[role="dialog"]',dialog=>dialog.textContent.includes('Tujuan/sasaran penjelas')),false);
        const context=await page.$$eval('[role="dialog"] textarea',inputs=>inputs.slice(0,3).map(n=>n.value));
        assert.deepEqual(context,['Tujuan pelayanan kesehatan','Program pelayanan daerah','IKU Direktur']);
        await page.$eval('#iku-color',input=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'#00ff00');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));});
        await page.waitForFunction(()=>document.querySelector('[role="dialog"]').textContent.includes('#00FF00'));
        const dir=path.join(root,'storage/app/cascading-template-qa');fs.mkdirSync(dir,{recursive:true});
        await page.screenshot({path:path.join(dir,'iku-color-picker-dark.png'),fullPage:true});
        await page.$eval('[role="dialog"] form',form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
        await page.waitForFunction(()=>window.saved?.data.cascading_color==='#00FF00');
        assert.deepEqual(await page.evaluate(()=>window.saved.url),{name:'kinerja.nodes',params:[1,'1']});
        await page.click('[aria-label="Edit IKU Direktur"]');await page.waitForSelector('#iku-color');
        await clickText('Gunakan warna bawaan');assert.equal(await page.$eval('#iku-color',input=>input.value),'#bfbfbf');
        await page.$eval('[role="dialog"] form',form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
        await page.waitForFunction(()=>window.saved?.data.cascading_color===null);
        await page.click('[aria-label="Edit IKU Bawaan"]');await page.waitForSelector('#iku-color');
        assert.equal(await page.$eval('#iku-color',input=>input.value),'#ffff00');await clickText('Batal');
        await chooseLevel(2);await page.click('[aria-label="Edit Kegiatan Wadir A"]');await page.waitForSelector('[role="dialog"]');assert.equal(await page.$('#iku-color'),null);await clickText('Batal');
        await chooseLevel(1);await page.evaluate(()=>document.documentElement.classList.remove('dark'));
        await page.setViewport({width:390,height:900});await page.click('[aria-label="Edit IKU Direktur"]');await page.waitForSelector('#iku-color');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        await page.screenshot({path:path.join(dir,'iku-color-picker-mobile.png'),fullPage:true});await clickText('Batal');
        await page.evaluate(()=>window.mount('kinerja',true));await clickText('Fitur 1–4');
        assert.equal(await page.$$eval('tbody button[aria-label^="Edit "]',nodes=>nodes.length),0);
        assert.deepEqual(errors,[]);console.log('PASS: strategic navigation and editing, IKU parent field order, no redundant IKU button, custom and default colors, light/dark contrast, picker save payload, reset, other levels, closed period, mobile layout.');
    } finally {await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});