import{K as a,a as i}from"./app-99ef0eb0.js";import u from"./Form-688cb3fd.js";import"./ComboboxPage-a73498ae.js";import"./use-tracked-pointer-b0e2e50f.js";import"./transition-9c7d8c03.js";import"./keyboard-ae49841d.js";import"./use-resolve-button-type-c9292bc7.js";import"./use-watch-3ec0c030.js";import"./InputError-db58d90d.js";import"./InputLabel-7af8523f.js";import"./PrimaryButton-41d745e5.js";import"./SecondaryButton-a8193bcc.js";import"./TextAreaInput-8a12107e.js";import"./TextInput-2629e86a.js";import"./TextInputWithError-cd44c6d7.js";/* empty css                         */function q({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:""});return i("form",{onSubmit:r=>{r.preventDefault(),p(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:i(u,{errors:n,data:o,ShouldMap:m,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{q as default};
