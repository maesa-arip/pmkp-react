import{K as u,a as e}from"./app-deaba12f.js";import c from"./Form-bf71fa86.js";import"./SecondaryButton-0599126b.js";import"./TextAreaInput-f974cf67.js";import"./TextInput-4dda37a4.js";/* empty css                         */function d({setIsOpenAddDialog:t,ShouldMap:s}){const{data:o,setData:i,post:m,reset:n,errors:a}=u({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{n(),t(!1)}})},children:e(c,{errors:a,data:o,ShouldMap:s,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{d as default};
