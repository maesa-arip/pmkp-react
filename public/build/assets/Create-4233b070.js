import{K as i,a as e}from"./app-de05624d.js";import p from"./Form-f7cdeee4.js";import"./InputError-8e313441.js";import"./InputLabel-2355428e.js";import"./PrimaryButton-cd02b555.js";import"./SecondaryButton-f2f829ff.js";import"./TextInput-5a9d338d.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:a,post:m,reset:n,errors:s}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("IkpGrupLayanan.store"),{data:o,onSuccess:()=>{n(),t(!1)}})},children:e(p,{errors:s,data:o,setData:a,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};