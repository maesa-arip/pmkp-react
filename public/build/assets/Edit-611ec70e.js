import{K as Z,r as $,a as Q}from"./app-43246a29.js";import I from"./Form-027c8666.js";import"./ComboboxPage-05afddcc.js";import"./use-tracked-pointer-aac8e847.js";import"./render-b2513a84.js";import"./keyboard-316c5b02.js";import"./use-outside-click-c0e3ef2d.js";import"./use-tree-walker-cd8f7dff.js";import"./use-controllable-71132425.js";import"./transition-b0fc3aad.js";import"./use-watch-f1862f0e.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./SecondaryButton-d32e9bed.js";import"./TextAreaInput-1926018e.js";import"./TextInput-e2264539.js";import"./ComboboxMultiple-7a5d909d.js";import"./clsx-82ef765e.js";import"./defineProperty-8250cd14.js";import"./ComboboxPageReadonly-b4a7baa7.js";function mi({setIsOpenEditDialog:t,model:i,ShouldMap:R}){var _,p,k,g,r,l,e,h,v,u,b,j,c,f,m,o,y,x,E;const{data:s,setData:n,put:T,reset:V,errors:W}=Z({penyebab:(_=i.ikp_hasil)==null?void 0:_.penyebab,akarmasalah:(p=i.ikp_hasil)==null?void 0:p.akarmasalah,rekomendasi:(k=i.ikp_hasil)==null?void 0:k.rekomendasi,pj1:(g=i.ikp_hasil)==null?void 0:g.pj1,tanggal_rekomendasi:(r=i.ikp_hasil)==null?void 0:r.tanggal_rekomendasi,tindakan:(l=i.ikp_hasil)==null?void 0:l.tindakan,pj2:(e=i.ikp_hasil)==null?void 0:e.pj2,tanggal_tindakan:(h=i.ikp_hasil)==null?void 0:h.tanggal_tindakan,nama:(v=i.ikp_hasil)==null?void 0:v.nama,verifikasi:(u=i.ikp_hasil)==null?void 0:u.verifikasi,tanggal_mulai_investigasi:(b=i.ikp_hasil)==null?void 0:b.tanggal_mulai_investigasi,tanggal_selesaii_investigasi:(j=i.ikp_hasil)==null?void 0:j.tanggal_selesaii_investigasi,investigasi_lengkap:(c=i.ikp_hasil)==null?void 0:c.investigasi_lengkap,tanggal_investigasi:(f=i.ikp_hasil)==null?void 0:f.tanggal_investigasi,investigasi_lanjut:(m=i.ikp_hasil)==null?void 0:m.investigasi_lanjut,ikp_dampak2_id:(o=i.ikp_hasil)==null?void 0:o.ikp_dampak2_id,ikp_probabilitas2_id:(y=i.ikp_hasil)==null?void 0:y.ikp_probabilitas2_id,tanggal_cek:(x=i.ikp_hasil)==null?void 0:x.tanggal_cek,tindak_lanjut:(E=i.ikp_hasil)==null?void 0:E.tindak_lanjut}),X=a=>t(!1),Y=a=>{a.preventDefault(),T(route("ikppasien.hasilinvestigasi",i.id),{data:s,onSuccess:()=>{V(),t(!1)}})};return $.useEffect(()=>{var a,S,B,D,F,K,U,q,w,z,A,C,G,H,J,L,M,N,P;n({...s,penyebab:(a=i.ikp_hasil)==null?void 0:a.penyebab,akarmasalah:(S=i.ikp_hasil)==null?void 0:S.akarmasalah,rekomendasi:(B=i.ikp_hasil)==null?void 0:B.rekomendasi,pj1:(D=i.ikp_hasil)==null?void 0:D.pj1,tanggal_rekomendasi:(F=i.ikp_hasil)==null?void 0:F.tanggal_rekomendasi,tindakan:(K=i.ikp_hasil)==null?void 0:K.tindakan,pj2:(U=i.ikp_hasil)==null?void 0:U.pj2,tanggal_tindakan:(q=i.ikp_hasil)==null?void 0:q.tanggal_tindakan,nama:(w=i.ikp_hasil)==null?void 0:w.nama,verifikasi:(z=i.ikp_hasil)==null?void 0:z.verifikasi,tanggal_mulai_investigasi:(A=i.ikp_hasil)==null?void 0:A.tanggal_mulai_investigasi,tanggal_selesaii_investigasi:(C=i.ikp_hasil)==null?void 0:C.tanggal_selesaii_investigasi,investigasi_lengkap:(G=i.ikp_hasil)==null?void 0:G.investigasi_lengkap,tanggal_investigasi:(H=i.ikp_hasil)==null?void 0:H.tanggal_investigasi,investigasi_lanjut:(J=i.ikp_hasil)==null?void 0:J.investigasi_lanjut,ikp_dampak2_id:(L=i.ikp_hasil)==null?void 0:L.ikp_dampak2_id,ikp_probabilitas2_id:(M=i.ikp_hasil)==null?void 0:M.ikp_probabilitas2_id,tanggal_cek:(N=i.ikp_hasil)==null?void 0:N.tanggal_cek,tindak_lanjut:(P=i.ikp_hasil)==null?void 0:P.tindak_lanjut})},[i]),Q("form",{onSubmit:Y,children:Q(I,{errors:W,data:s,setData:n,model:i,ShouldMap:R,submit:"Update",closeButton:X})})}export{mi as default};