import{K as n,a as e}from"./app-40227382.js";import u from"./Form-ea038e04.js";import"./InputError-0cf9554f.js";import"./InputLabel-4fdd6287.js";import"./PrimaryButton-ce8a4982.js";import"./SecondaryButton-e376ea20.js";import"./TextInput-70d63fd3.js";function d({setIsOpenAddDialog:t}){const{data:o,setData:s,post:a,reset:m,errors:i}=n({value:"",name:""});return e("form",{onSubmit:r=>{r.preventDefault(),a(route("IkpProbabilitas.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(u,{errors:i,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{d as default};