import{K as a,a as i}from"./app-45c362e4.js";import u from"./Form-539f5fc2.js";import"./ComboboxPage-d3c7a0a7.js";import"./use-tracked-pointer-698fd130.js";import"./transition-aa6ff992.js";import"./keyboard-759aa11c.js";import"./use-resolve-button-type-be735f7f.js";import"./use-watch-8cfe6e14.js";import"./InputError-f1d1ef92.js";import"./InputLabel-c5e11497.js";import"./PrimaryButton-40599a16.js";import"./SecondaryButton-06de0a12.js";import"./TextAreaInput-b7c688a7.js";import"./TextInput-28cedb88.js";import"./TextInputWithError-fa2553f0.js";/* empty css                         */function q({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:""});return i("form",{onSubmit:r=>{r.preventDefault(),p(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:i(u,{errors:n,data:o,ShouldMap:m,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{q as default};
