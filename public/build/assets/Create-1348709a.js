import{K as i,a as e}from"./app-12155d7d.js";import p from"./Form-31034b53.js";import"./InputError-b39280a0.js";import"./InputLabel-a6ff48db.js";import"./PrimaryButton-bf4695c7.js";import"./SecondaryButton-456a1177.js";import"./TextInput-d440a1d3.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:m,post:s,reset:a,errors:n}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("IkpPelapor.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(p,{errors:n,data:o,setData:m,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};