const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
(async () => {
    const root = path.resolve(__dirname, '../..');
    const bundle = await esbuild.build({
        stdin: { resolveDir: root, loader: 'jsx', contents: `
            import React, {useState} from 'react'; import {createRoot} from 'react-dom/client';
            import Copy from './resources/js/Pages/RiskRegister/Copy/Index.jsx';
            window.route = name => name;
            function Fixture() {
                const [filters,setFilters] = useState({copy_mode:'year',risk_code_mode:'preserve',source_year:2024,target_year:2025,priority_scope:'all'});
                window.setPreview=setFilters;
                return <Copy filters={filters} preview={{eligible:1,source_total:1}} options={{users:[],pics:[]}}/>;
            }
            createRoot(document.getElementById('root')).render(<Fixture/>);
        ` },
        bundle: true, write: false, jsx: 'automatic', alias: {'@': path.join(root,'resources/js')},
        define: {'process.env.NODE_ENV':'"production"'},
        plugins: [{name:'fixture',setup(build) {
            build.onResolve({filter:/^@\/Layouts\/App$/}, () => ({path:'layout',namespace:'fixture'}));
            build.onResolve({filter:/^@inertiajs\/react$/}, () => ({path:'inertia',namespace:'fixture'}));
            build.onLoad({filter:/.*/,namespace:'fixture'}, args => ({resolveDir:root,loader:'js',contents:args.path === 'layout' ? 'export default function App({children}) {return children;}' : `
                import {useState} from 'react';
                export function Head(){return null;}
                export const router={get(url,data){window.lastGet=data;setTimeout(()=>window.setPreview(data),100);},post(url,data,options){window.lastPost=data;options.onFinish();}};
                export function useForm(initial){const [data,set]=useState(initial);return {data,setData(key,value){set(old=>typeof key==='function'?key(old):{...old,[key]:value});}};}
            `}));
        }}],
    });
    const browser = await puppeteer.launch({headless:true});
    try {
        const page = await browser.newPage();
        const errors=[];page.on('pageerror',error=>errors.push(error.message));
        await page.setViewport({width:1280,height:1000});
        await page.setContent('<div id="root"></div>');
        const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));
        await page.addStyleTag({path:path.join(root,'public/build',manifest['resources/js/app.jsx'].css[0])});
        await page.addScriptTag({content:bundle.outputFiles[0].text});
        await page.waitForSelector('input[value="preserve"]');
        assert.equal(await page.$eval('input[value="preserve"]',el=>el.checked),true);
        const execute=()=>page.$$eval('button',buttons=>buttons.find(b=>b.textContent.trim()==='Eksekusi Copy').disabled);
        assert.equal(await execute(),false);
        await page.click('input[value="new"]');
        assert.equal(await execute(),true);
        await page.waitForFunction(()=>window.lastGet?.risk_code_mode==='new');
        await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Eksekusi Copy'&&!b.disabled));
        await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Eksekusi Copy').click());
        await page.waitForSelector('[role="dialog"]');
        assert.match(await page.$eval('[role="dialog"]',el=>el.textContent),/Kode risiko baru dibuat sesuai tahun tujuan/);
        await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Ya, Eksekusi Copy')).click());
        await page.waitForFunction(()=>window.lastPost?.risk_code_mode==='new');
        await page.waitForSelector('[role="dialog"]',{hidden:true});
        await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Copy Antar Unit')).click());
        assert.equal(await page.$eval('input[value="preserve"]',el=>el.disabled),true);
        assert.equal(await page.$eval('input[value="new"]',el=>el.checked),true);
        await page.waitForFunction(()=>window.lastGet?.copy_mode==='unit');
        await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Copy Antar Tahun')).click());
        assert.equal(await page.$eval('input[value="preserve"]',el=>el.checked),true);
        await page.setViewport({width:390,height:844});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
        const dir=path.join(root,'storage/app/risk-copy-qa');fs.mkdirSync(dir,{recursive:true});
        await page.screenshot({path:path.join(dir,'mobile.png'),fullPage:true});
        assert.deepEqual(errors,[]);
        console.log('PASS: default code, preview gating, new-code submission, unit mode, mobile layout.');
    } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});