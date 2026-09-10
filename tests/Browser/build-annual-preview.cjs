// Local browser QA fixture. No authentication bypass and no production data.
const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
    const root = path.resolve(__dirname, '../..');
    const out = await esbuild.build({
        stdin: { contents: `
            import React from 'react';
            import {createRoot} from 'react-dom/client';
            import Index from './resources/js/Pages/Kinerja/Index.jsx';
            window.route = (name, params) => '#'+name;
            const params = new URLSearchParams(location.search);
            document.documentElement.classList.toggle('dark', params.get('theme') === 'dark');
            const period = {id: 1, tahun: 2027, status: params.get('status') || 'aktif', nama_organisasi:'RSUD Contoh', tujuan:'Meningkatnya mutu pelayanan kesehatan', rekonstruksi:false};
            const common = {periode_kinerja_id:1,is_active:1,sort_order:1,kode_cascading:'1.1',jabatan:'Wakil Direktur Pelayanan'};
            const tree = [{id:1,level:'1',display_code:'1',name:'Meningkatnya mutu pelayanan rumah sakit',jabatan:'Direktur',children:[1,2,3].map(i=>({id:10+i,level:'2',display_code:'1.'+i,name:'Peningkatan kinerja pelayanan '+i,jabatan:'Penanggung jawab program '+i,children:[{id:20+i,level:'3',display_code:'1.'+i+'.a',name:'Terlaksananya kegiatan pelayanan sesuai standar',children:[{id:30+i,level:'4',display_code:'1.'+i+'.a.1',name:'Persentase layanan sesuai standar',children:[]}]}]}))}];
            createRoot(document.getElementById('root')).render(<main className="min-h-screen bg-slate-50 p-4 font-sans dark:bg-slate-900 sm:p-6"><Index periods={[period]} period={period} cascadingTree={tree} nodes={{
                sasaran:[{...common,id:1,name:'Meningkatnya mutu pelayanan',parent_id:0}],
                1:[{...common,id:2,name:'Indeks kepuasan masyarakat',tujuan:'Meningkatnya kepuasan pengguna layanan',sasaran_strategis_id:1}],
                2:[{...common,id:3,name:'Persentase capaian standar pelayanan',sasaran_strategis_id:1,indikator_fitur1_id:2}],
                3:[{...common,id:4,name:'Kepatuhan standar pelayanan medik',sasaran_strategis_id:1,indikator_fitur2_id:3}],
                4:Array.from({length:32},(_,i)=>({...common,id:5+i,name:'Persentase pelaksanaan pelayanan sesuai standar '+(i+1),sasaran_strategis_id:1,indikator_fitur3_id:4,location_id:'[1]'})), '04':[]
            }} locations={[{id:1,name:'Unit Pelayanan Medik'}]} exports={[]} /></main>);
        `, resolveDir: root, loader: 'jsx' },
        bundle: true, write: false, jsx: 'automatic', define: {'process.env.NODE_ENV':'"production"'},
        plugins: [{name:'fixture', setup(build) {
            build.onResolve({filter:/^@inertiajs\/react$|^@\/Layouts\/App$/}, args => ({path:args.path,namespace:'mock'}));
            build.onLoad({filter:/.*/,namespace:'mock'}, args => ({contents: args.path.includes('Layouts') ? 'export default function App({children}) {return children;}' : `
                import {useState} from 'react';
                export function Head(){return null;}
                export const router={get(){}};
                export function useForm(initial){ const [data, update]=useState(initial); return {data,errors:{},processing:false,
                  setData(key,value){update(old=>typeof key==='string'?{...old,[key]:value}:key);},clearErrors(){},post(){},put(){}}; }
            `,loader:'js',resolveDir:root}));
        }}],
    });
    const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/build/manifest.json')));
    const css=manifest['resources/js/app.jsx'].css[0];
    fs.writeFileSync(path.join(root,'public/annual-ui-qa.html'), `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pratinjau indikator tahunan</title><link rel="stylesheet" href="/build/${css}"></head><body><div id="root"></div><script>${out.outputFiles[0].text}</script></body></html>`);
}
main().catch(error=>{console.error(error);process.exit(1);});
