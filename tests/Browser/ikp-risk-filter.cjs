const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const puppeteer = require('puppeteer');

async function main() {
    const root = path.resolve(__dirname, '../..');
    const bundle = await esbuild.build({
        stdin: {
            contents: `
                import React, { useCallback, useState } from 'react';
                import { createRoot } from 'react-dom/client';
                import Form from './resources/js/Pages/IKP/Pasien/Form.jsx';
                const risks = [
                    { id: 1, name: 'Risiko Unit A', pic_ids: [8] },
                    { id: 2, name: 'Risiko Unit B', pic_ids: [21] },
                    { id: 3, name: 'Risiko Bersama', pic_ids: [8, 21] },
                ];
                function Harness({ admin }) {
                    const [data, update] = useState({ pic_id: '', risiko_teridentifikasi: true });
                    const setData = useCallback((key, value) => {
                        if (typeof key === 'string') update(old => ({ ...old, [key]: value }));
                        else update(key);
                    }, []);
                    window.formData = data;
                    return <Form errors={{}} data={data} setData={setData} submit="Simpan"
                        closeButton={() => {}} ShouldMap={{ canViewAllRisks: admin,
                            riskRegisters: admin ? risks : [risks[0], risks[2]],
                            riskUnit: { id: 8, name: 'Unit A' },
                            pics: [{ id: 8, name: 'Unit A' }, { id: 21, name: 'Unit B' }]
                        }} />;
                }
                const root = createRoot(document.getElementById('root'));
                window.mount = admin => root.render(<Harness key={String(admin)} admin={admin} />);
                window.mount(true);
            `,
            resolveDir: root,
            loader: 'jsx',
        },
        alias: { '@': path.join(root, 'resources/js') },
        jsx: 'automatic',
        define: { 'process.env.NODE_ENV': '"production"' },
        bundle: true,
        write: false,
    });
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
        await page.setViewport({ width: 1280, height: 900 });
        await page.setContent('<div id="root" class="max-w-5xl h-screen mx-auto"></div>');
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/build/manifest.json')));
        const css = manifest['resources/js/app.jsx'].css[0];
        await page.addStyleTag({ path: path.join(root, 'public/build', css) });
        await page.addScriptTag({ content: bundle.outputFiles[0].text });
        await page.waitForSelector('input[role="combobox"]');
        const clickText = async text => {
            const option = await page.evaluate(text => {
                const element = [...document.querySelectorAll('button,[role="option"]')]
                    .find(element => element.textContent.trim() === text);
                if (!element) throw new Error('Missing control: ' + text);
                element.click();
                return element.getAttribute('role') === 'option';
            }, text);
            if (option) await page.waitForSelector('[role="option"]', { hidden: true });
        };
        const openCombo = async index => {
            await page.evaluate(index => document.querySelectorAll('input[role="combobox"]')[index]
                .parentElement.querySelector('button').click(), index);
            await page.waitForSelector('[role="option"]');
        };
        const options = () => page.$$eval('[role="option"]', nodes => nodes.map(node => node.textContent.trim()));
        await openCombo(0);
        assert.deepEqual(await options(), ['Risiko Unit A', 'Risiko Unit B', 'Risiko Bersama']);
        await clickText('Risiko Unit A');
        await clickText('Unit Dipilih');
        await page.waitForFunction(() => document.body.textContent.includes('Belum ada unit dipilih.'));
        await openCombo(0);
        await clickText('Unit B');
        await openCombo(1);
        assert.deepEqual(await options(), ['Risiko Unit B', 'Risiko Bersama']);
        await clickText('Risiko Unit B');
        await page.waitForFunction(() => window.formData.risk_register_id === 2);
        assert.equal(await page.evaluate(() => window.formData.pic_id), '');
        await clickText('Semua');
        await openCombo(0);
        assert.equal((await options()).length, 3);
        await clickText('Risiko Bersama');
        await clickText('Unit Dipilih');

        const outputDir = path.join(root, 'storage/app/ikp-ui-check');
        fs.mkdirSync(outputDir, { recursive: true });
        for (const width of [1280, 390]) {
            await page.setViewport({ width, height: 900 });
            await page.screenshot({ path: path.join(outputDir, 'admin-' + width + '.png') });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        }
        await page.evaluate(() => window.mount(false));
        await page.waitForFunction(() => ![...document.querySelectorAll('button')].some(node => node.textContent.trim() === 'Semua'));
        await openCombo(0);
        assert.deepEqual(await options(), ['Risiko Unit A', 'Risiko Bersama']);
        assert.deepEqual(errors, []);
        console.log('PASS: admin all/unit filters, independent incident unit, non-admin list, desktop/mobile layout.');
    } finally {
        await browser.close();
    }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
