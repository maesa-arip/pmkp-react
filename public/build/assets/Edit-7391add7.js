import{K as m,r as d,a as c}from"./app-43246a29.js";import q from"./Form-d38a223b.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./RadioCard-5857dae7.js";import"./render-b2513a84.js";import"./keyboard-316c5b02.js";import"./description-f1b6d31b.js";import"./use-tree-walker-cd8f7dff.js";import"./use-controllable-71132425.js";import"./SecondaryButton-d32e9bed.js";import"./TextAreaInput-1926018e.js";import"./TextInput-e2264539.js";import"./TextInputWithError-4c41efc5.js";import"./moment-fbc5633a.js";/* empty css                         */function J({setIsOpenEditDialog:e,model:t,ShouldMap:o}){var p,n,s;const{data:a,setData:i,put:g,reset:k,errors:y}=m({id:t.id,tgl_register:t.tgl_register,created_at:t.created_at,currently_id:t.currently_id,pernyataan_risiko:t.pernyataan_risiko,tgl_perbaikan:((p=t.requestupdate)==null?void 0:p.tgl_perbaikan)??"",jam_perbaikan:((n=t.requestupdate)==null?void 0:n.jam_perbaikan)??"",upaya_pengendalian:((s=t.requestupdate)==null?void 0:s.upaya_pengendalian)??""}),b=r=>e(!1),f=r=>{r.preventDefault(),g(route("riskregister.updatestatus",t.id),{data:a,onSuccess:()=>{k(),e(!1)}})};return d.useEffect(()=>{var r,u,_;i({...a,id:t.id,tgl_register:t.tgl_register,created_at:t.created_at,currently_id:t.currently_id,pernyataan_risiko:t.pernyataan_risiko,tgl_perbaikan:((r=t.requestupdate)==null?void 0:r.tgl_perbaikan)??"",jam_perbaikan:((u=t.requestupdate)==null?void 0:u.jam_perbaikan)??"",upaya_pengendalian:((_=t.requestupdate)==null?void 0:_.upaya_pengendalian)??""})},[t]),c("form",{onSubmit:f,children:c(q,{errors:y,data:a,model:t,ShouldMap:o,setData:i,submit:"Simpan",closeButton:b})})}export{J as default};