import{K as R,r as T,a as H}from"./app-ea82073e.js";import U from"./Form-c7c0a03e.js";import"./InputError-dcc04ab5.js";import"./InputLabel-41825ea6.js";import"./PrimaryButton-2d77b83a.js";import"./SecondaryButton-4739f7c9.js";import"./TextAreaInput-2bf375e1.js";import"./TextInput-25fea345.js";import"./TextInputWithError-3456dc3c.js";/* empty css                         */function sa({setIsOpenEditDialog:n,model:a,ShouldMap:J}){var e,d,i,o,t,_,b,u,f,k,g,l,c,m,h,y;const{data:s,setData:p,put:L,reset:M,errors:N}=R({id:a.id,osd2_dampak:a.osd2_dampak,osd2_probabilitas:a.osd2_probabilitas,concatdp2:a.concatdp2,osd2_inherent:a.osd2_inherent,pernyataan_risiko:a.pernyataan_risiko,dampak_responden1:((e=a.fgdresidual)==null?void 0:e.dampak_responden1)??"",dampak_responden2:((d=a.fgdresidual)==null?void 0:d.dampak_responden2)??"",dampak_responden3:((i=a.fgdresidual)==null?void 0:i.dampak_responden3)??"",dampak_responden4:((o=a.fgdresidual)==null?void 0:o.dampak_responden4)??"",dampak_responden5:((t=a.fgdresidual)==null?void 0:t.dampak_responden5)??"",dampak_responden6:((_=a.fgdresidual)==null?void 0:_.dampak_responden6)??"",dampak_responden7:((b=a.fgdresidual)==null?void 0:b.dampak_responden7)??"",dampak_responden8:((u=a.fgdresidual)==null?void 0:u.dampak_responden8)??"",probabilitas_responden1:((f=a.fgdresidual)==null?void 0:f.probabilitas_responden1)??"",probabilitas_responden2:((k=a.fgdresidual)==null?void 0:k.probabilitas_responden2)??"",probabilitas_responden3:((g=a.fgdresidual)==null?void 0:g.probabilitas_responden3)??"",probabilitas_responden4:((l=a.fgdresidual)==null?void 0:l.probabilitas_responden4)??"",probabilitas_responden5:((c=a.fgdresidual)==null?void 0:c.probabilitas_responden5)??"",probabilitas_responden6:((m=a.fgdresidual)==null?void 0:m.probabilitas_responden6)??"",probabilitas_responden7:((h=a.fgdresidual)==null?void 0:h.probabilitas_responden7)??"",probabilitas_responden8:((y=a.fgdresidual)==null?void 0:y.probabilitas_responden8)??""}),P=r=>n(!1),Q=r=>{r.preventDefault(),L(route("riskregister.fgdresidual",a.id),{data:s,onSuccess:()=>{M(),n(!1)}})};return T.useEffect(()=>{var r,x,S,E,j,v,B,D,F,K,q,w,z,A,C,G;p({...s,id:a.id,osd2_dampak:a.osd2_dampak,osd2_probabilitas:a.osd2_probabilitas,concatdp2:a.concatdp2,osd2_inherent:a.osd2_inherent,pernyataan_risiko:a.pernyataan_risiko,dampak_responden1:((r=a.fgdresidual)==null?void 0:r.dampak_responden1)??"",dampak_responden2:((x=a.fgdresidual)==null?void 0:x.dampak_responden2)??"",dampak_responden3:((S=a.fgdresidual)==null?void 0:S.dampak_responden3)??"",dampak_responden4:((E=a.fgdresidual)==null?void 0:E.dampak_responden4)??"",dampak_responden5:((j=a.fgdresidual)==null?void 0:j.dampak_responden5)??"",dampak_responden6:((v=a.fgdresidual)==null?void 0:v.dampak_responden6)??"",dampak_responden7:((B=a.fgdresidual)==null?void 0:B.dampak_responden7)??"",dampak_responden8:((D=a.fgdresidual)==null?void 0:D.dampak_responden8)??"",probabilitas_responden1:((F=a.fgdresidual)==null?void 0:F.probabilitas_responden1)??"",probabilitas_responden2:((K=a.fgdresidual)==null?void 0:K.probabilitas_responden2)??"",probabilitas_responden3:((q=a.fgdresidual)==null?void 0:q.probabilitas_responden3)??"",probabilitas_responden4:((w=a.fgdresidual)==null?void 0:w.probabilitas_responden4)??"",probabilitas_responden5:((z=a.fgdresidual)==null?void 0:z.probabilitas_responden5)??"",probabilitas_responden6:((A=a.fgdresidual)==null?void 0:A.probabilitas_responden6)??"",probabilitas_responden7:((C=a.fgdresidual)==null?void 0:C.probabilitas_responden7)??"",probabilitas_responden8:((G=a.fgdresidual)==null?void 0:G.probabilitas_responden8)??""})},[a]),H("form",{onSubmit:Q,children:H(U,{errors:N,data:s,model:a,ShouldMap:J,setData:p,submit:"Simpan",closeButton:P})})}export{sa as default};
