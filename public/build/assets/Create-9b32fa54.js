import{K as u,a as e}from"./app-2bf39a84.js";import c from"./Form-b643209e.js";import"./SecondaryButton-e4da5bbe.js";import"./TextAreaInput-2cbda4ee.js";import"./TextInput-5bea8677.js";/* empty css                         */function d({setIsOpenAddDialog:t,ShouldMap:s}){const{data:o,setData:i,post:m,reset:n,errors:a}=u({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{n(),t(!1)}})},children:e(c,{errors:a,data:o,ShouldMap:s,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{d as default};