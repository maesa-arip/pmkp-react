import{K as i,a as e}from"./app-12155d7d.js";import p from"./Form-cedabaa3.js";import"./InputError-b39280a0.js";import"./InputLabel-a6ff48db.js";import"./PrimaryButton-bf4695c7.js";import"./SecondaryButton-456a1177.js";import"./TextInput-d440a1d3.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:a,post:m,reset:n,errors:s}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("IkpGrupLayanan.store"),{data:o,onSuccess:()=>{n(),t(!1)}})},children:e(p,{errors:s,data:o,setData:a,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};