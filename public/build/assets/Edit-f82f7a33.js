import{K as F,r as K,a as x}from"./app-c54a562f.js";import M from"./Form-1b5cb2e7.js";import"./InputError-80a9159c.js";import"./InputLabel-c3873a4b.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./TextAreaInput-2720a1db.js";import"./TextInput-0606da2e.js";import"./TextInputWithError-4013c962.js";/* empty css                         */function J({setIsOpenEditDialog:u,model:a,ShouldMap:S}){var s,n,i,_,o,c,m;const{data:p,setData:r,put:E,reset:j,errors:v}=F({id:a.id,problem:((s=a.mutu_pdsa)==null?void 0:s.problem)??"",step:((n=a.mutu_pdsa)==null?void 0:n.step)??"",plan_rencana:((i=a.mutu_pdsa)==null?void 0:i.plan_rencana)??"",plan_harapan:((_=a.mutu_pdsa)==null?void 0:_.plan_harapan)??"",do:((o=a.mutu_pdsa)==null?void 0:o.do)??"",study:((c=a.mutu_pdsa)==null?void 0:c.study)??"",action:((m=a.mutu_pdsa)==null?void 0:m.action)??""}),B=t=>u(!1),D=t=>{t.preventDefault(),E(route("MutuUnit.formulirpdsa",a.id),{data:p,onSuccess:()=>{j(),u(!1)}})};return K.useEffect(()=>{var t,d,e,f,b,h,y;r({...p,id:a.id,problem:((t=a.mutu_pdsa)==null?void 0:t.problem)??"",step:((d=a.mutu_pdsa)==null?void 0:d.step)??"",plan_rencana:((e=a.mutu_pdsa)==null?void 0:e.plan_rencana)??"",plan_harapan:((f=a.mutu_pdsa)==null?void 0:f.plan_harapan)??"",do:((b=a.mutu_pdsa)==null?void 0:b.do)??"",study:((h=a.mutu_pdsa)==null?void 0:h.study)??"",action:((y=a.mutu_pdsa)==null?void 0:y.action)??""})},[a]),x("form",{onSubmit:D,children:x(M,{errors:v,data:p,model:a,ShouldMap:S,setData:r,submit:"Simpan",closeButton:B})})}export{J as default};
