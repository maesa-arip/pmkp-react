import{K as m,r as x,a as f}from"./app-43246a29.js";import S from"./Form-2da7b70b.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./SecondaryButton-d32e9bed.js";import"./TextAreaInput-1926018e.js";import"./TextInput-e2264539.js";import"./TextInputWithError-4c41efc5.js";import"./moment-fbc5633a.js";/* empty css                         */function H({setIsOpenEditDialog:e,model:a,ShouldMap:o}){var n,p,u,s,_;const{data:r,setData:i,put:q,reset:y,errors:b}=m({id:a.id,tgl_register:a.tgl_register,created_at:a.created_at,currently_id:a.currently_id,pernyataan_risiko:a.pernyataan_risiko,request_update_id:((n=a.requestupdate)==null?void 0:n.id)??"",tgl_perbaikan:((p=a.requestupdate)==null?void 0:p.tgl_perbaikan)??"",jam_perbaikan:((u=a.requestupdate)==null?void 0:u.jam_perbaikan)??"",upaya_pengendalian:((s=a.requestupdate)==null?void 0:s.upaya_pengendalian)??"",keterangan:((_=a.requestupdateverificationadmin)==null?void 0:_.keterangan)??""}),j=t=>e(!1),v=t=>{t.preventDefault(),q(route("riskregister.storeverificationadminoccurring",a.id),{data:r,onSuccess:()=>{y(),e(!1)}})};return x.useEffect(()=>{var t,c,g,d,k;i({...r,id:a.id,tgl_register:a.tgl_register,created_at:a.created_at,currently_id:a.currently_id,pernyataan_risiko:a.pernyataan_risiko,request_update_id:((t=a.requestupdate)==null?void 0:t.id)??"",tgl_perbaikan:((c=a.requestupdate)==null?void 0:c.tgl_perbaikan)??"",jam_perbaikan:((g=a.requestupdate)==null?void 0:g.jam_perbaikan)??"",upaya_pengendalian:((d=a.requestupdate)==null?void 0:d.upaya_pengendalian)??"",keterangan:((k=a.requestupdateverificationadmin)==null?void 0:k.keterangan)??""})},[a]),f("form",{onSubmit:v,children:f(S,{errors:b,data:r,model:a,ShouldMap:o,setData:i,submit:"Simpan",closeButton:j})})}export{H as default};