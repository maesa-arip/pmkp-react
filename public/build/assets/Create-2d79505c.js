import{K as i,a as e}from"./app-43246a29.js";import p from"./Form-2cb12816.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./SecondaryButton-d32e9bed.js";import"./TextInput-e2264539.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:n,reset:m,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("opsiPengendalians.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:a,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};