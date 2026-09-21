const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');
const puppeteer = require('puppeteer');

(async () => {
    const result = await esbuild.build({
        stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import useExport from './resources/js/Pages/Kinerja/useCascadingExport';
        function Harness() { const [period, setPeriod] = React.useState(1); const x = useExport(period); window.changePeriod = setPeriod; window.startExport = x.download; return <main className="space-y-4 p-6"><button className="rounded-xl bg-sky-600 p-3 text-white disabled:opacity-50" disabled={x.busy} onClick={() => x.download('/export')}>{x.busy ? 'Menyiapkan Excel' : 'Ekspor'}</button><p role="status" className="text-sm text-slate-800">{x.status?.type}: {x.status?.message}</p></main>; } createRoot(document.getElementById('root')).render(<Harness />);`, loader: 'jsx', resolveDir: process.cwd() },
        bundle: true, write: false, format: 'iife', plugins: [{ name: 'mock-reload', setup(build) {
            build.onResolve({ filter: /^@inertiajs\/react$/ }, () => ({ path: 'router', namespace: 'mock' }));
            build.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: 'export const router = { reload: () => window.reloads++ };' }));
        } }],
    });
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.setContent('<div id="root" class="min-h-screen bg-slate-50"></div>');
        const css = fs.readdirSync('public/build/assets').find(name => name.endsWith('.css') && name.startsWith('app-'));
        if (css) await page.addStyleTag({ path: path.resolve('public/build/assets', css) });
        await page.evaluate(() => {
            window.reloads = 0; window.requests = 0; window.downloads = [];
            HTMLAnchorElement.prototype.click = function () { window.downloads.push(this.download); };
            window.fetch = (url, options) => { window.requests++; return new Promise((resolve, reject) => {
                window.resolveExport = resolve; window.rejectExport = reject;
                options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
            }); };
        });
        await page.addScriptTag({ content: result.outputFiles[0].text });
        await page.waitForSelector('button');
        await page.click('button');
        await page.waitForFunction(() => document.querySelector('button').disabled && document.querySelector('[role=status]').textContent.includes('Menyiapkan file'));
        await page.evaluate(() => window.startExport('/export'));
        assert.equal(await page.evaluate(() => window.requests), 1, 'duplicate requests blocked');
        await page.evaluate(() => window.resolveExport(new Response(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 0x50, 0x4b, 0x05, 0x06, ...new Array(18).fill(0)]), { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename=Cascading-2026-42.xlsx' } })));
        await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('success:'));
        assert.deepEqual(await page.evaluate(() => window.downloads), ['Cascading-2026-42.xlsx']);
        assert.equal(await page.evaluate(() => window.reloads), 1);
        for (const [status, body, text] of [[422, JSON.stringify({ errors: { hierarki: ['Perbaiki hierarki sebelum ekspor.'] } }), 'Perbaiki hierarki'], [500, '<html>Server error</html>', 'Ekspor gagal'], [401, '{}', 'Sesi Anda telah berakhir'], [200, '<html>Login</html>', 'Server tidak mengembalikan']]) {
            await page.click('button');
            await page.evaluate((status, body) => window.resolveExport(new Response(body, { status, headers: { 'Content-Type': 'application/json' } })), status, body);
            await page.waitForFunction(text => document.querySelector('[role=status]').textContent.includes(text) && !document.querySelector('button').disabled, {}, text);
        }
        await page.click('button');
        await page.evaluate(() => window.rejectExport(new TypeError('Failed to fetch')));
        await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('Koneksi terputus'));
        await page.click('button');
        await page.evaluate(() => window.resolveExport(new Response(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1]), { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } })));
        await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('File Excel gagal dibuat') && !document.querySelector('button').disabled);
        await page.click('button');
        await page.evaluate(() => window.changePeriod(2));
        await page.waitForFunction(() => !document.querySelector('button').disabled && !document.querySelector('[role=status]').textContent.includes('Menyiapkan'));
        await page.evaluate(() => { window.startExport('/archive', 42); });
        await page.waitForFunction(() => document.querySelector('button').disabled);
        await page.evaluate(() => window.resolveExport(new Response(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 0x50, 0x4b, 0x05, 0x06, ...new Array(18).fill(0)]), { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } })));
        await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('success:'));
        assert.equal(await page.evaluate(() => window.reloads), 1, 'archive downloads do not reload archive list');
        assert.equal(await page.evaluate(() => window.downloads.length), 2, 'errors never trigger downloads');
        console.log('PASS: loading, duplicate prevention, filename/download, archive refresh, validation/server/session/network errors, unexpected HTML/truncated ZIP, period cancellation, retry and archive download.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });