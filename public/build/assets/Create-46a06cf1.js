import{K as a,a as e}from"./app-f24c4d87.js";import p from"./Form-a19017c7.js";import"./InputError-a4173606.js";import"./InputLabel-9ac2099d.js";import"./PrimaryButton-2173daf6.js";import"./SecondaryButton-ef888e1f.js";import"./TextAreaInput-32cf6113.js";import"./TextInput-2dbd284a.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:m,reset:i,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("jenisSebabs.store"),{data:o,onSuccess:()=>{i(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};
