import{K as a,a as e}from"./app-a515daf2.js";import p from"./Form-6c27a882.js";import"./InputError-e663b23a.js";import"./InputLabel-2a3bf0b1.js";import"./PrimaryButton-8cbe1ff8.js";import"./SecondaryButton-f2acca44.js";import"./TextAreaInput-13841cb0.js";import"./TextInput-673b07f1.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:m,reset:i,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("jenisSebabs.store"),{data:o,onSuccess:()=>{i(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};
