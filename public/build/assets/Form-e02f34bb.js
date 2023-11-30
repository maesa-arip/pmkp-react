import{r as m,j as l,F as f,a}from"./app-40227382.js";import{I as s}from"./InputError-0cf9554f.js";import{I as t}from"./InputLabel-4fdd6287.js";import{P as h}from"./PrimaryButton-ce8a4982.js";import{R as v}from"./RadioCard-80e78950.js";import{S as _}from"./SecondaryButton-e376ea20.js";import{T as u}from"./TextAreaInput-919603c2.js";import{T as c}from"./TextInput-70d63fd3.js";import"./TextInputWithError-f69ac6cb.js";import{h as d}from"./moment-fbc5633a.js";/* empty css                         */import"./render-66257b5b.js";import"./keyboard-61a26669.js";import"./description-bdba954c.js";import"./use-tree-walker-55160274.js";import"./use-controllable-2ece201f.js";function J({errors:i,submit:g,data:e,setData:n,ShouldMap:p,model:o,closeButton:y}){console.log(o.currently_id),m.useEffect(()=>{n({...e,pernyataan_risiko:"Karena "+e.sebab+" Kemungkinan "+e.resiko+" Sehingga "+e.dampak})},[e.sebab,e.resiko,e.dampak]);const[b,k]=m.useState(()=>o?p.currently.find(r=>r.id===o.currently_id):defaultValue[0]);return m.useState(null),m.useState(null),l(f,{children:[a("div",{className:"px-4 py-5 bg-white sm:p-6",children:l("div",{className:"grid grid-cols-12 gap-6",children:[l("div",{className:"col-span-12 p-6 my-6 border-4 border-gray-200 rounded-lg ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Data Risiko"}),a("div",{className:"grid grid-cols-12 gap-6",children:l("div",{className:"col-span-12",children:[a(t,{for:"pernyataan risiko",value:"Pernyataan Risiko"}),a(u,{id:"pernyataan_risiko",readOnly:!0,value:e.pernyataan_risiko??"",handleChange:r=>n("pernyataan_risiko",r.target.value),type:"text",className:"block w-full mt-1"}),a(s,{message:i.pernyataan_risiko,className:"mt-2"})]})})]}),l("div",{className:"col-span-12 p-6 my-6 border-4 border-gray-200 rounded-lg ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700",children:"Data PIC Unit Terkait"}),l("div",{className:"grid grid-cols-12 gap-6",children:[l("div",{className:"col-span-6",children:[a(t,{for:"created_at",value:"Tanggal Input"}),a(c,{id:"created_at",readOnly:!0,value:d(e.created_at).format("YYYY-MM-DD"),type:"text",className:"block w-full mt-1"})]}),l("div",{className:"col-span-6",children:[a(t,{for:"created_at",value:"Jam Input"}),a(c,{id:"created_at",readOnly:!0,value:d(e.created_at).format("H:MM"),type:"text",className:"block w-full mt-1"})]}),l("div",{className:"col-span-6",children:[a(t,{for:"tgl_perbaikan",value:"Tanggal Perbaikan"}),a(c,{id:"tgl_perbaikan",readOnly:!0,value:d(e.tgl_perbaikan).format("YYYY-MM-DD"),handleChange:r=>n("tgl_perbaikan",r.target.value),type:"text",className:"block w-full mt-1"}),a(s,{message:i.tgl_perbaikan,className:"mt-2"})]}),l("div",{className:"col-span-6",children:[a(t,{for:"jam_perbaikan",value:"Jam Perbaikan"}),a(c,{id:"jam_perbaikan",value:e.jam_perbaikan,readOnly:!0,handleChange:r=>n("jam_perbaikan",r.target.value),type:"time",className:"block w-full mt-1"}),a(s,{message:i.jam_perbaikan,className:"mt-2"})]}),l("div",{className:"col-span-12",children:[a(t,{for:"upaya_pengendalian",value:"Upaya Pengendalian"}),a(u,{id:"upaya_pengendalian",readOnly:!0,value:e.upaya_pengendalian,handleChange:r=>n("upaya_pengendalian",r.target.value),type:"text",className:"block w-full mt-1"}),a(s,{message:i.upaya_pengendalian,className:"mt-2"})]}),l("div",{className:"col-span-12 mt-6",children:[a(v,{ShouldMap:p.currently,selected:b,onChange:r=>{n({...e,currently_id:r.id}),k(r)}}),a(s,{message:i.currently_id,className:"mt-2"})]})]})]})]})}),l("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[a(h,{children:g}),a(_,{className:"mx-2",onClick:y,children:"Batal"})]})]})}export{J as default};