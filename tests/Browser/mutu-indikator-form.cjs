const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');

async function main() {
    const root = path.resolve(__dirname, '../..');
    const dir = path.join(root, 'storage/app/mutu-form-qa');
    fs.mkdirSync(dir, { recursive: true });
    const bundle = await esbuild.build({
        stdin: { resolveDir: root, loader: 'jsx', contents: `
            import React, { useState } from 'react';
            import { createRoot } from 'react-dom/client';
            import Create from './resources/js/Pages/MUTU/MutuIndikator/Create.jsx';
            import Edit from './resources/js/Pages/MUTU/MutuIndikator/Edit.jsx';
            import AddModal from './resources/js/Components/Modal/AddModal.jsx';
            import EditModal from './resources/js/Components/Modal/EditModal.jsx';
            window.route = (name, id) => ({ name, id });
            const maps = {
                tahun: 2026, Periods: [{id:1,tahun:2026},{id:2,tahun:2027}],
                IndikatorBaru: [{id:0,name:'Tidak'},{id:1,name:'Ya'}],
                IndikatorFitur3: [{id:31,periode_kinerja_id:1,is_active:1,name:'Kegiatan induk 2026'}, {id:32,periode_kinerja_id:2,is_active:1,name:'Kegiatan induk 2027'}],
                IndikatorFitur4: [{id:41,periode_kinerja_id:1,indikator_fitur3_id:31,is_active:1,name:'Persentase kelengkapan dokumen perencanaan dan pelaporan indikator mutu seluruh unit kerja rumah sakit'}, {id:42,periode_kinerja_id:2,indikator_fitur3_id:32,is_active:1,name:'Indikator 2027'}],
                MutuKategori: [{id:1,name:'Indikator mutu unit'}],
                Operator: [{id:'≥',name:'≥'},{id:'=',name:'='}], Penyebut: [{id:'%',name:'%'},{id:'hari',name:'hari'}],
            };
            const model = {id:99,tahun:2026,periode_kinerja_id:1,indikator_fitur4_id:41,indikator_fitur4:{indikator_fitur3_id:31},mutu_kategori_id:1,num_name:'Jumlah sesuai',denum_name:'Jumlah semua',operator:'=',standar:0,penyebut:'%'};
            function Fixture({mode}) {
                const [open,setOpen] = useState(true);
                const formMaps = {...maps, ...window.backendMaps, ...(mode === 'empty' ? {IndikatorFitur4: []} : {})};
                return <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
                    <button className="rounded-lg bg-sky-600 px-4 py-2 text-white" onClick={()=>setOpen(true)}>Buka form</button>
                    {mode === 'edit' ? <EditModal title="Edit Indikator Mutu" isOpenEditDialog={open} setIsOpenEditDialog={setOpen}><Edit model={model} ShouldMap={formMaps} setIsOpenEditDialog={setOpen}/></EditModal> : <AddModal title="Tambah Indikator Mutu" isOpenAddDialog={open} setIsOpenAddDialog={setOpen}><Create ShouldMap={formMaps} setIsOpenAddDialog={setOpen}/></AddModal>}
                </main>;
            }
            const root = createRoot(document.getElementById('root'));
            let revision = 0;
            window.mount = (mode='create') => root.render(<Fixture key={++revision} mode={mode}/>);
            window.mount();
        ` },
        bundle: true, write: false, jsx: 'automatic', alias: { '@': path.join(root, 'resources/js') },
        define: { 'process.env.NODE_ENV': '"production"' },
        plugins: [{ name: 'inertia-fixture', setup(build) {
            build.onResolve({ filter: /^@inertiajs\/react$/ }, args => ({ path: args.path, namespace: 'fixture' }));
            build.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ resolveDir: root, loader: 'js', contents: `
                import {useState} from 'react';
                export function useForm(initial) {
                    const [data,set] = useState(initial), [errors,setErrors] = useState({}), [processing,setProcessing] = useState(false);
                    window.formData=data; window.showErrors=setErrors;
                    const send=(url,options)=>{window.saved={url,data};window.submissions=(window.submissions||0)+1;setProcessing(true);window.finish=()=>{setProcessing(false);options.onSuccess();};};
                    return {data,errors,processing,setData(key,value){set(old=>typeof key==='string'?{...old,[key]:value}:key);},reset(){set(initial);},post:send,put:send};
                }
            ` }));
        } }],
    });
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.setViewport({ width: 1440, height: 1000 });
        await page.setContent('<html lang="id"><body><div id="root"></div></body></html>');
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/build/manifest.json')));
        await page.addStyleTag({ path: path.join(root, 'public/build', manifest['resources/js/app.jsx'].css[0]) });
        await page.addScriptTag({ content: bundle.outputFiles[0].text });
        await page.waitForSelector('#mutu-year');
        const choose = async (id, text) => {
            await page.click('#' + id);
            await page.keyboard.press('ArrowDown');
            await page.waitForSelector('[role="option"]');
            const option = await page.evaluateHandle(text => [...document.querySelectorAll('[role="option"]')].find(n => n.textContent.trim() === text), text);
            await option.asElement().click();
            await page.waitForSelector('[role="option"]', { hidden: true });
        };
        const fits = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('input,textarea,select')].every(n => {const r=n.getBoundingClientRect(); return r.left>=0 && r.right<=innerWidth;})), true, 'Fields must fit the viewport');
        const fill = async (selector, value) => { await page.$eval(selector, n => n.select()); await page.type(selector, value); };
        const longName = 'Persentase kelengkapan dokumen perencanaan dan pelaporan indikator mutu seluruh unit kerja rumah sakit';
        await choose('IndikatorBaru', 'Ya');
        await page.waitForSelector('#indikator');
        await choose('IndikatorBaru', 'Tidak');
        await page.waitForSelector('#indikator_fitur4_id');
        assert.equal(await page.$('#indikator'), null);
        await choose('indikator_fitur4_id', longName);
        await page.waitForFunction(() => window.formData.indikator_fitur3_id === 31);
        await choose('mutu_kategori_id', 'Indikator mutu unit');
        await page.type('#num_name', 'Jumlah sesuai'); await page.type('#denum_name', 'Jumlah semua');
        await choose('operator', '≥'); await fill('#standar', '95.5'); await choose('penyebut', '%');
        assert.equal(await page.$eval('form', n => n.checkValidity()), true, 'Decimal target must be accepted');
        await fits();
        await page.waitForTimeout(350); await page.screenshot({ path: path.join(dir, 'create-desktop.png'), fullPage: true });
        await page.click('button[type="submit"]');
        await page.waitForFunction(() => window.saved?.data.standar === '95.5');
        assert.equal(await page.$eval('button[type="submit"]', n => n.disabled && n.textContent === 'Menyimpan...'), true);
        await page.click('button[type="submit"]'); assert.equal(await page.evaluate(() => window.submissions), 1);
        assert.equal(await page.evaluate(() => window.saved.url.name), 'MutuIndikator.store');
        await page.evaluate(() => window.finish()); await page.waitForSelector('[role="dialog"]', { hidden: true });

        await page.evaluate(() => window.mount()); await page.waitForSelector('#mutu-year');
        await page.setViewport({ width: 390, height: 844 });
        await choose('IndikatorBaru', 'Ya'); await page.type('#indikator', 'Indikator baru pengujian'); await choose('indikator_fitur3_id', 'Kegiatan induk 2026');
        await page.select('#mutu-year', '2027');
        await page.waitForFunction(() => window.formData.periode_kinerja_id === 2 && window.formData.indikator_fitur3_id === '');
        await choose('indikator_fitur3_id', 'Kegiatan induk 2027');
        await page.evaluate(() => window.showErrors({indikator:'Nama indikator wajib diisi.',standar:'Nilai target wajib diisi.',mutu_kategori_id:'Pilih kategori mutu.'}));
        await page.waitForFunction(() => document.body.textContent.includes('Nilai target wajib diisi.'));
        assert.equal(await page.$eval('#standar', n => n.getAttribute('aria-invalid')), 'true');
        await fits(); await page.waitForTimeout(350); await page.screenshot({ path: path.join(dir, 'create-mobile-errors.png'), fullPage: true });
        await page.setViewport({ width: 320, height: 640 }); await fits();
        await page.evaluate(() => window.mount('edit')); await page.waitForFunction(() => document.querySelector('#mutu-year')?.disabled);
        assert.equal(await page.$eval('#standar', n => n.value), '0');
        assert.equal(await page.$('#IndikatorBaru'), null);
        await page.setViewport({ width: 390, height: 844 });
        await page.click('#indikator_fitur4_id'); await page.keyboard.press('ArrowDown'); await page.waitForSelector('[role="option"]');
        assert.equal(await page.$eval('[role="option"] span', n => getComputedStyle(n).whiteSpace), 'normal');
        const optionVisible = await page.$eval('[role="option"]', n => {const r=n.getBoundingClientRect(); const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); return n.contains(hit);});
        assert.equal(optionVisible, true, 'Dropdown must appear above following form sections');
        await page.waitForTimeout(350); await page.screenshot({ path: path.join(dir, 'edit-mobile-dropdown.png'), fullPage: true });
        await page.keyboard.press('Escape');
        await page.evaluate(() => document.documentElement.classList.add('dark'));
        await fits(); await page.waitForTimeout(350); await page.screenshot({ path: path.join(dir, 'edit-mobile-dark.png'), fullPage: true });
        await page.setViewport({ width: 1440, height: 1000 });
        await page.waitForTimeout(350); await page.screenshot({ path: path.join(dir, 'edit-desktop-dark.png'), fullPage: true });
        await page.click('button[type="submit"]'); await page.waitForFunction(() => window.saved.url.name === 'MutuIndikator.update');
        assert.equal(await page.evaluate(() => window.saved.url.id), 99);
        assert.equal(await page.evaluate(() => window.saved.data.standar), 0);
        await page.evaluate(() => window.finish()); await page.waitForSelector('[role="dialog"]', { hidden: true });
        await page.evaluate(() => window.mount()); await page.waitForSelector('#mutu-year');
        await page.$$eval('button', nodes => nodes.find(n=>n.textContent==='Batal').click());
        await page.waitForSelector('[role="dialog"]', { hidden: true });
        await page.evaluate(() => window.mount('empty')); await page.waitForSelector('#mutu-year');
        await page.$eval('#indikator_fitur4_id', n => n.parentElement.querySelector('button').click());
        await page.waitForSelector('[role="listbox"]');
        assert.equal(await page.$$eval('[role="option"]', nodes => nodes.length), 0);
        assert.match(await page.$eval('[role="listbox"]', n => n.textContent), /Tidak ada indikator aktif yang dapat Anda akses pada tahun 2026/);
        await page.type('#indikator_fitur4_id', 'tidak ditemukan');
        assert.match(await page.$eval('[role="listbox"]', n => n.textContent), /Data tidak ditemukan/);
        await page.keyboard.press('Escape');
        if (process.env.MUTU_OPTIONS_FIXTURE) {
            const cases = JSON.parse(fs.readFileSync(process.env.MUTU_OPTIONS_FIXTURE, 'utf8').replace(/^\uFEFF/, ''));
            for (const maps of cases) {
                await page.evaluate(maps => {window.backendMaps = maps; window.mount();}, maps);
                await page.waitForSelector('#mutu-year');
                await choose('IndikatorBaru', 'Ya'); await choose('IndikatorBaru', 'Tidak');
                await page.$eval('#indikator_fitur4_id', n => n.parentElement.querySelector('button').click());
                await page.waitForSelector('[role="listbox"]');
                const period = maps.Periods.find(p => Number(p.tahun) === maps.tahun);
                const expected = maps.IndikatorFitur4.filter(i => String(i.periode_kinerja_id) === String(period.id) && i.is_active).length;
                assert.equal(await page.$$eval('[role="option"]', nodes => nodes.length), expected);
                console.log(`PASS: real backend options for ${maps.tahun}: ${expected} available indicators after Ya -> Tidak.`);
                await page.keyboard.press('Escape');
                for (const option of maps.Penyebut || []) {
                    await choose('penyebut', option.name);
                    assert.equal(await page.evaluate(() => window.formData.penyebut), option.name);
                    assert.equal(await page.evaluate(() => typeof window.formData.penyebut), 'string');
                    assert.equal(await page.$eval('#penyebut', n => n.value), option.name);
                }
                if (maps.Penyebut?.length) console.log(`PASS: ${maps.Penyebut.length} actual backend unit options keep the correct string value.`);
            }
        }
        assert.deepEqual(errors, []);
        console.log('PASS: actual add/edit modals, year/parent selection, create/update payloads, decimal and zero target, validation, duplicate-submit protection, cancel, long dropdown options, light/dark and 320/390/1440px layouts. Inertia requests use a fixture; no database writes.');
    } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
