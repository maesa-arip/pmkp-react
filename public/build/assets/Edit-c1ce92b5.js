import{K as T,r as U,a as J}from"./app-99ef0eb0.js";import V from"./Form-de2df69a.js";import"./InputError-db58d90d.js";import"./InputLabel-7af8523f.js";import"./PrimaryButton-41d745e5.js";import"./SecondaryButton-a8193bcc.js";import"./TextAreaInput-8a12107e.js";import"./TextInput-2629e86a.js";import"./TextInputWithError-cd44c6d7.js";/* empty css                         */function rn({setIsOpenEditDialog:a,model:n,ShouldMap:L}){var i,s,t,d,o,_,b,f,k,h,g,m,u,c,y,x;const{data:r,setData:p,put:M,reset:N,errors:P}=T({id:n.id,pernyataan_risiko:n.pernyataan_risiko,dampak_responden1:((i=n.fgdinherent)==null?void 0:i.dampak_responden1)??"",dampak_responden2:((s=n.fgdinherent)==null?void 0:s.dampak_responden2)??"",dampak_responden3:((t=n.fgdinherent)==null?void 0:t.dampak_responden3)??"",dampak_responden4:((d=n.fgdinherent)==null?void 0:d.dampak_responden4)??"",dampak_responden5:((o=n.fgdinherent)==null?void 0:o.dampak_responden5)??"",dampak_responden6:((_=n.fgdinherent)==null?void 0:_.dampak_responden6)??"",dampak_responden7:((b=n.fgdinherent)==null?void 0:b.dampak_responden7)??"",dampak_responden8:((f=n.fgdinherent)==null?void 0:f.dampak_responden8)??"",probabilitas_responden1:((k=n.fgdinherent)==null?void 0:k.probabilitas_responden1)??"",probabilitas_responden2:((h=n.fgdinherent)==null?void 0:h.probabilitas_responden2)??"",probabilitas_responden3:((g=n.fgdinherent)==null?void 0:g.probabilitas_responden3)??"",probabilitas_responden4:((m=n.fgdinherent)==null?void 0:m.probabilitas_responden4)??"",probabilitas_responden5:((u=n.fgdinherent)==null?void 0:u.probabilitas_responden5)??"",probabilitas_responden6:((c=n.fgdinherent)==null?void 0:c.probabilitas_responden6)??"",probabilitas_responden7:((y=n.fgdinherent)==null?void 0:y.probabilitas_responden7)??"",probabilitas_responden8:((x=n.fgdinherent)==null?void 0:x.probabilitas_responden8)??""}),Q=e=>a(!1),R=e=>{e.preventDefault(),M(route("riskregister.fgdinherent",n.id),{data:r,onSuccess:()=>{N(),a(!1)}})};return U.useEffect(()=>{var e,S,E,j,v,B,D,F,K,q,w,z,A,C,G,H;p({...r,id:n.id,pernyataan_risiko:n.pernyataan_risiko,dampak_responden1:((e=n.fgdinherent)==null?void 0:e.dampak_responden1)??"",dampak_responden2:((S=n.fgdinherent)==null?void 0:S.dampak_responden2)??"",dampak_responden3:((E=n.fgdinherent)==null?void 0:E.dampak_responden3)??"",dampak_responden4:((j=n.fgdinherent)==null?void 0:j.dampak_responden4)??"",dampak_responden5:((v=n.fgdinherent)==null?void 0:v.dampak_responden5)??"",dampak_responden6:((B=n.fgdinherent)==null?void 0:B.dampak_responden6)??"",dampak_responden7:((D=n.fgdinherent)==null?void 0:D.dampak_responden7)??"",dampak_responden8:((F=n.fgdinherent)==null?void 0:F.dampak_responden8)??"",probabilitas_responden1:((K=n.fgdinherent)==null?void 0:K.probabilitas_responden1)??"",probabilitas_responden2:((q=n.fgdinherent)==null?void 0:q.probabilitas_responden2)??"",probabilitas_responden3:((w=n.fgdinherent)==null?void 0:w.probabilitas_responden3)??"",probabilitas_responden4:((z=n.fgdinherent)==null?void 0:z.probabilitas_responden4)??"",probabilitas_responden5:((A=n.fgdinherent)==null?void 0:A.probabilitas_responden5)??"",probabilitas_responden6:((C=n.fgdinherent)==null?void 0:C.probabilitas_responden6)??"",probabilitas_responden7:((G=n.fgdinherent)==null?void 0:G.probabilitas_responden7)??"",probabilitas_responden8:((H=n.fgdinherent)==null?void 0:H.probabilitas_responden8)??""})},[n]),J("form",{onSubmit:R,children:J(V,{errors:P,data:r,model:n,ShouldMap:L,setData:p,submit:"Simpan",closeButton:Q})})}export{rn as default};
