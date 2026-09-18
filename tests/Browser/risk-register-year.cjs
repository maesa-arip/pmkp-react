const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');

async function main() {
    const root = path.resolve(__dirname, '../..');
    const mapNames = new Set(['pics']);
    for (const type of ['Klinis', 'NonKlinis']) {
        for (const match of fs.readFileSync(path.join(root, 'resources/js/Pages/RiskRegister', type, 'Form.jsx'), 'utf8').matchAll(/ShouldMap\.(\w+)/g)) mapNames.add(match[1]);
    }
    const maps = Object.fromEntries([...mapNames].map(name => [name, [{ id: 1, name: 'Pilihan uji', value: 1 }]]));
    maps.indikatorFitur4s = [
        { id: 26, name: 'Indikator 2026', tahun: 2026, is_active: true, can_select: true },
        { id: 27, name: 'Indikator 2027', tahun: 2027, is_active: true, can_select: true },
        { id: 28, name: 'Indikator tidak aktif', tahun: 2026, is_active: false, can_select: true },
        { id: 29, name: 'Indikator PIC lain', tahun: 2026, is_active: true, can_select: false },
    ];
    const periods = [{ id: 1, tahun: 2024, status: 'ditutup' }, { id: 2, tahun: 2026, status: 'aktif' }, { id: 3, tahun: 2027, status: 'aktif' }, { id: 4, tahun: 2028, status: 'aktif' }];
    const bundle = await esbuild.build({
        stdin: { resolveDir: root, loader: 'jsx', contents: `
            import React, {useState} from 'react'; import {createRoot} from 'react-dom/client';
            import Klinis from './resources/js/Pages/RiskRegister/Klinis/Create.jsx';
            import NonKlinis from './resources/js/Pages/RiskRegister/NonKlinis/Create.jsx';
            import Filter from './resources/js/Components/AnnualYearFilter.jsx';
            window.route = name => name;
            const root = createRoot(document.getElementById('root'));
            const maps = ${JSON.stringify(maps)};
            function Screen({type}) {const [year,setYear]=useState('2026');const Form=type==='Klinis'?Klinis:NonKlinis;return <main className="mx-auto max-w-6xl bg-slate-50 p-4 dark:bg-slate-950"><Filter value={year} onChange={value=>{setYear(value);window.filterYear=value;}}/><Form ShouldMap={maps} setIsOpenAddDialog={()=>{}}/></main>}
            window.mount=type=>root.render(<Screen key={type} type={type}/>);window.mount('Klinis');
        ` },
        bundle: true, write: false, outdir: 'storage/app/risk-register-qa', jsx: 'automatic',
        alias: { '@': path.join(root, 'resources/js') }, define: { 'process.env.NODE_ENV': '"production"' },
        plugins: [{ name: 'inertia-fixture', setup(build) {
            build.onResolve({ filter: /^@inertiajs\/react$/ }, args => ({ path: args.path, namespace: 'fixture' }));
            build.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ resolveDir: root, loader: 'js', contents: `
                import {useState} from 'react';
                export const router={get(){}};
                export function usePage(){return {props:{annualPeriods:${JSON.stringify(periods)}}};}
                export function useForm(initial){const [data,set]=useState(initial);window.data=data;return {data,errors:{},processing:false,
                    setData(key,value){set(old=>typeof key==='function'?key(old):typeof key==='string'?{...old,[key]:value}:key);},
                    reset(){set(initial);},post(url){window.saved={url,data};}};}
            ` }));
        } }],
    });
    const browser = await puppeteer.launch({ headless: true });
    let page;
    try {
        page = await browser.newPage();
        page.setDefaultTimeout(10000);
        const errors = [];
        page.on('pageerror', error => {errors.push(error.message);console.error('PAGE ERROR', error.message);});
        await page.setViewport({ width: 1280, height: 1000 });
        await page.setContent('<div id="root"></div>');
        await page.evaluate(() => {
            const RealDate = Date;
            window.Date = class extends RealDate {
                constructor(...args) { super(...(args.length ? args : [2026, 8, 17, 12])); }
                static now() { return new RealDate(2026, 8, 17, 12).getTime(); }
            };
        });
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/build/manifest.json')));
        await page.addStyleTag({ path: path.join(root, 'public/build', manifest['resources/js/app.jsx'].css[0]) });
        for (const output of bundle.outputFiles.filter(file => file.path.endsWith('.css'))) await page.addStyleTag({ content: output.text });
        await page.addScriptTag({ content: bundle.outputFiles.find(file => file.path.endsWith('.js')).text });
        const choose = async (selector, label) => {
            await page.click(selector);
            await page.waitForSelector('[role="option"]');
            await page.evaluate(label => [...document.querySelectorAll('[role="option"]')].find(option => option.textContent.trim() === label).click(), label);
            await page.waitForSelector('[role="listbox"]', { hidden: true });
        };
        const yearButton = 'form button[aria-haspopup="listbox"]';
        const indicatorOptions = async () => {
            await page.$eval('form input[role="combobox"]', input => input.parentElement.querySelector('button').click());
            await page.waitForSelector('[role="option"]');
            return page.$$eval('[role="option"]', options => options.map(option => option.textContent.trim()));
        };
        const dir = path.join(root, 'storage/app/risk-register-qa');fs.mkdirSync(dir, { recursive: true });
        for (const type of ['Klinis', 'NonKlinis']) {
            await page.evaluate(type => window.mount(type), type);
            await page.waitForFunction(() => window.data?.tahun === '2026');
            assert.equal(await page.$eval('input[name="tgl_register"]', input => input.disabled), false);
            assert.equal(await page.$eval('form input[role="combobox"]', input => input.value), '');
            assert.equal(await page.$eval('form input[role="combobox"]', input => input.placeholder), 'Pilih indikator');
            assert.equal(await page.$eval('form input[role="combobox"]', input => input.matches(':placeholder-shown')), true);
            await page.click('input[name="tgl_register"]');
            await page.waitForSelector('.react-datepicker__current-month');
            assert.equal(await page.$eval('.react-datepicker__current-month', label => label.textContent), 'September 2026');
            await page.screenshot({ path: path.join(dir, type + '-active-year-calendar.png') });
            for (let month = 8; month > 0; month--) {
                await page.click('.react-datepicker__navigation--previous');
            }
            assert.equal(await page.$eval('.react-datepicker__current-month', label => label.textContent), 'January 2026');
            assert.equal(await page.$$eval('.react-datepicker__navigation--previous', buttons => buttons.every(button => button.disabled || button.className.includes('--disabled'))), true);
            await page.keyboard.press('Escape');
            await page.click(yearButton);
            assert.equal(await page.$$eval('[role="option"]', options => options.find(option => option.textContent.includes('2024')).getAttribute('aria-disabled')), 'true');
            await page.keyboard.press('Escape');
            await choose(yearButton, '2026 — Aktif');
            assert.deepEqual(await indicatorOptions(), ['Indikator 2026']);
            await page.click('[role="option"]');await page.waitForSelector('[role="listbox"]',{hidden:true});
            await page.waitForFunction(() => window.data.indikator_fitur4_id === 26);
            assert.equal(await page.$eval('form input[role="combobox"]', input => input.matches(':placeholder-shown')), false);
            await page.type('input[name="tgl_register"]', '15-06-2026');await page.keyboard.press('Tab');
            await page.waitForFunction(() => window.data.tgl_register === '2026-06-15');
            await page.click('input[name="tgl_register"]');
            await page.keyboard.down('Control');await page.keyboard.press('A');await page.keyboard.up('Control');
            await page.type('input[name="tgl_register"]', '15-06-2027');await page.keyboard.press('Tab');
            assert.equal(await page.evaluate(() => window.data.tgl_register), '', 'Typing a different year must not submit the previous date');
            await page.type('#resiko', 'Risiko uji browser');
            await choose(yearButton, '2027 — Aktif');
            assert.equal(await page.evaluate(() => window.data.indikator_fitur4_id), '');
            assert.equal(await page.evaluate(() => window.data.tgl_register), '');
            assert.equal(await page.$eval('input[name="tgl_register"]', input=>input.value), '');
            assert.equal(await page.evaluate(() => window.data.resiko), 'Risiko uji browser');
            assert.deepEqual(await indicatorOptions(), ['Indikator 2027']);await page.click('[role="option"]');await page.waitForSelector('[role="listbox"]',{hidden:true});
            await choose(yearButton, '2028 — Aktif');
            assert.ok(await page.$eval('form', form => form.textContent.includes('Tidak ada indikator')));
            await choose(yearButton, '2026 — Aktif');
            await indicatorOptions();await page.click('[role="option"]');await page.waitForSelector('[role="listbox"]',{hidden:true});
            await page.type('input[name="tgl_register"]', '15-06-2026');await page.keyboard.press('Tab');
            await page.click('button[type="submit"]');
            assert.equal(await page.evaluate(() => window.saved.data.tahun), '2026');
            assert.equal(await page.evaluate(() => window.saved.data.indikator_fitur4_id), 26);
            assert.equal(await page.evaluate(() => window.saved.data.tgl_register), '2026-06-15');
            assert.equal(await page.evaluate(() => window.saved.url), 'riskRegister' + type + '.store');
            await page.evaluate(() => window.scrollTo(0,0));
            await page.screenshot({ path: path.join(dir, type + '-desktop.png') });
            await page.setViewport({ width: 390, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, type + ' mobile overflow');
            await page.screenshot({ path: path.join(dir, type + '-mobile.png') });
            await page.setViewport({ width: 1280, height: 1000 });
        }
        await choose('main > div button[aria-haspopup="listbox"]', '2024 — Ditutup');
        assert.equal(await page.evaluate(() => window.filterYear), '2024');
        assert.deepEqual(errors, []);
        console.log('PASS: both forms, automatic active year, muted indicator placeholder, calendar opens current month and cannot enter previous year, indicator/PIC filtering, reset on year change, empty year, date, submit payload, closed-year filter, desktop/mobile; no browser runtime errors.');
    } catch(error) { console.error('STATE',await page.evaluate(()=>({year:window.data?.tahun,indicator:window.data?.indikator_fitur4_id,date:window.data?.tgl_register,input:document.querySelector('input[name="tgl_register"]')?.value})));await page.screenshot({path:path.join(root,'storage/app/risk-register-qa/failure.png')});throw error;} finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exit(1); });
