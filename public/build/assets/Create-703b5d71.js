import{K as i,a as e}from"./app-deaba12f.js";import u from"./Form-95c7f0c7.js";import"./InputError-69d219ea.js";import"./InputLabel-c23c89f4.js";import"./PrimaryButton-4345420b.js";import"./SecondaryButton-0599126b.js";import"./TextInput-4dda37a4.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:m,reset:n,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("locations.store"),{data:o,onSuccess:()=>{n(),t(!1)}})},children:e(u,{errors:a,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};
