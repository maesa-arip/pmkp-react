import{K as a,a as e}from"./app-d3d4087f.js";import p from"./Form-8c30a5a3.js";import"./InputError-6bb1a026.js";import"./InputLabel-ad77c239.js";import"./PrimaryButton-588a671c.js";import"./SecondaryButton-b1b12734.js";import"./TextAreaInput-3c06e53b.js";import"./TextInput-d85a7c80.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:m,reset:i,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("jenisSebabs.store"),{data:o,onSuccess:()=>{i(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};
