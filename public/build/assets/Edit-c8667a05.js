import{K as m,r as d,a as c}from"./app-51ace3d0.js";import q from"./Form-b3433108.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./PrimaryButton-25f33bf3.js";import"./RadioCard-ea8d87a3.js";import"./render-4c1b6d6f.js";import"./keyboard-5d080c87.js";import"./description-4ae251f0.js";import"./use-tree-walker-6d933456.js";import"./use-controllable-b6d2b5ff.js";import"./SecondaryButton-d2b15658.js";import"./TextAreaInput-b5ac16d1.js";import"./TextInput-fe0f0eaf.js";import"./TextInputWithError-25d7d662.js";import"./moment-fbc5633a.js";/* empty css                         */function J({setIsOpenEditDialog:e,model:t,ShouldMap:o}){var p,n,s;const{data:a,setData:i,put:g,reset:k,errors:y}=m({id:t.id,tgl_register:t.tgl_register,created_at:t.created_at,currently_id:t.currently_id,pernyataan_risiko:t.pernyataan_risiko,tgl_perbaikan:((p=t.requestupdate)==null?void 0:p.tgl_perbaikan)??"",jam_perbaikan:((n=t.requestupdate)==null?void 0:n.jam_perbaikan)??"",upaya_pengendalian:((s=t.requestupdate)==null?void 0:s.upaya_pengendalian)??""}),b=r=>e(!1),f=r=>{r.preventDefault(),g(route("riskregister.updatestatus",t.id),{data:a,onSuccess:()=>{k(),e(!1)}})};return d.useEffect(()=>{var r,u,_;i({...a,id:t.id,tgl_register:t.tgl_register,created_at:t.created_at,currently_id:t.currently_id,pernyataan_risiko:t.pernyataan_risiko,tgl_perbaikan:((r=t.requestupdate)==null?void 0:r.tgl_perbaikan)??"",jam_perbaikan:((u=t.requestupdate)==null?void 0:u.jam_perbaikan)??"",upaya_pengendalian:((_=t.requestupdate)==null?void 0:_.upaya_pengendalian)??""})},[t]),c("form",{onSubmit:f,children:c(q,{errors:y,data:a,model:t,ShouldMap:o,setData:i,submit:"Simpan",closeButton:b})})}export{J as default};