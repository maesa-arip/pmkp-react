import{K as u,a as e}from"./app-76e0e351.js";import c from"./Form-c62746b8.js";import"./SecondaryButton-859ffd96.js";import"./TextAreaInput-e1272989.js";import"./TextInput-587695a3.js";/* empty css                         */function d({setIsOpenAddDialog:t,ShouldMap:s}){const{data:o,setData:i,post:m,reset:n,errors:a}=u({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{n(),t(!1)}})},children:e(c,{errors:a,data:o,ShouldMap:s,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{d as default};