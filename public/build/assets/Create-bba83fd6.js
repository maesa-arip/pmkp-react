import{K as c,a as e}from"./app-c16facc7.js";import f from"./Form-49448612.js";import"./InputError-76bbb453.js";import"./InputLabel-512383bf.js";import"./PrimaryButton-8f5509fc.js";import"./SecondaryButton-91e71e10.js";import"./TextInput-13418c97.js";import"./TextInputCheckbox-44fb8bfd.js";function C({setIsOpenAddDialog:t,permissions:s,enabled:m,setEnabled:a}){const{data:o,setData:i,post:n,reset:p,errors:u}=c({name:"",email:"",password:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("roles.store"),{data:o,onSuccess:()=>{p(),t(!1)}})},children:e(f,{errors:u,data:o,permissions:s,enabled:m,setEnabled:a,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{C as default};