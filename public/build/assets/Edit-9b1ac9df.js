import{K as x,r as S,a as d}from"./app-de05624d.js";import m from"./Form-20ff886f.js";import"./InputError-8e313441.js";import"./InputLabel-2355428e.js";import"./PrimaryButton-cd02b555.js";import"./SecondaryButton-f2f829ff.js";import"./TextAreaInput-c4e566b5.js";import"./TextInput-5a9d338d.js";import"./TextInputWithError-83806446.js";import"./moment-fbc5633a.js";/* empty css                         */function G({setIsOpenEditDialog:e,model:a,ShouldMap:f}){var n,p,u,s,_;const{data:t,setData:i,put:y,reset:b,errors:q}=x({id:a.id,tgl_register:a.tgl_register,created_at:a.created_at,currently_id:a.currently_id,pernyataan_risiko:a.pernyataan_risiko,request_update_id:((n=a.requestupdate)==null?void 0:n.id)??"",tgl_perbaikan:((p=a.requestupdate)==null?void 0:p.tgl_perbaikan)??"",jam_perbaikan:((u=a.requestupdate)==null?void 0:u.jam_perbaikan)??"",upaya_pengendalian:((s=a.requestupdate)==null?void 0:s.upaya_pengendalian)??"",keterangan:((_=a.verificationoccurringadmin)==null?void 0:_.keterangan)??""});console.log(a);const j=r=>e(!1),v=r=>{r.preventDefault(),y(route("riskregister.storeverificationadminoccurring",a.id),{data:t,onSuccess:()=>{b(),e(!1)}})};return S.useEffect(()=>{var r,c,g,k,o;i({...t,id:a.id,tgl_register:a.tgl_register,created_at:a.created_at,currently_id:a.currently_id,pernyataan_risiko:a.pernyataan_risiko,request_update_id:((r=a.requestupdate)==null?void 0:r.id)??"",tgl_perbaikan:((c=a.requestupdate)==null?void 0:c.tgl_perbaikan)??"",jam_perbaikan:((g=a.requestupdate)==null?void 0:g.jam_perbaikan)??"",upaya_pengendalian:((k=a.requestupdate)==null?void 0:k.upaya_pengendalian)??"",keterangan:((o=a.verificationpriorityadmin)==null?void 0:o.keterangan)??""})},[a]),d("form",{onSubmit:v,children:d(m,{errors:q,data:t,model:a,ShouldMap:f,setData:i,submit:"Simpan",closeButton:j})})}export{G as default};