import{K as v,r as x,a as f}from"./app-de05624d.js";import S from"./Form-81031b0f.js";import"./InputError-8e313441.js";import"./InputLabel-2355428e.js";import"./PrimaryButton-cd02b555.js";import"./SecondaryButton-f2f829ff.js";import"./TextAreaInput-c4e566b5.js";import"./TextInput-5a9d338d.js";import"./TextInputWithError-83806446.js";import"./moment-fbc5633a.js";/* empty css                         */function H({setIsOpenEditDialog:r,model:a,ShouldMap:o}){var n,p,u,s,_;const{data:e,setData:i,put:q,reset:y,errors:b}=v({id:a.id,tgl_register:a.tgl_register,created_at:a.created_at,currently_id:a.currently_id,pernyataan_risiko:a.pernyataan_risiko,request_update_id:((n=a.requestupdate)==null?void 0:n.id)??"",tgl_perbaikan:((p=a.requestupdate)==null?void 0:p.tgl_perbaikan)??"",jam_perbaikan:((u=a.requestupdate)==null?void 0:u.jam_perbaikan)??"",upaya_pengendalian:((s=a.requestupdate)==null?void 0:s.upaya_pengendalian)??"",keterangan:((_=a.requestupdateverificationmanagement)==null?void 0:_.keterangan)??""}),m=t=>r(!1),j=t=>{t.preventDefault(),q(route("riskregister.storeverificationmanagementoccurring",a.id),{data:e,onSuccess:()=>{y(),r(!1)}})};return x.useEffect(()=>{var t,g,c,k,d;i({...e,id:a.id,tgl_register:a.tgl_register,created_at:a.created_at,currently_id:a.currently_id,pernyataan_risiko:a.pernyataan_risiko,request_update_id:((t=a.requestupdate)==null?void 0:t.id)??"",tgl_perbaikan:((g=a.requestupdate)==null?void 0:g.tgl_perbaikan)??"",jam_perbaikan:((c=a.requestupdate)==null?void 0:c.jam_perbaikan)??"",upaya_pengendalian:((k=a.requestupdate)==null?void 0:k.upaya_pengendalian)??"",keterangan:((d=a.requestupdateverificationmanagement)==null?void 0:d.keterangan)??""})},[a]),f("form",{onSubmit:j,children:f(S,{errors:b,data:e,model:a,ShouldMap:o,setData:i,submit:"Simpan",closeButton:m})})}export{H as default};