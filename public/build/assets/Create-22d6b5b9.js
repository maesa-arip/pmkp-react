import{K as a,a as i}from"./app-65a84a67.js";import u from"./Form-7cd6c8cd.js";import"./RadioCard-27ef3170.js";import"./use-tracked-pointer-80a63ff7.js";import"./transition-c0977515.js";import"./keyboard-9d3148c6.js";import"./use-resolve-button-type-84594a97.js";import"./description-39d3b993.js";import"./InputError-9ea6194b.js";import"./InputLabel-7e55820d.js";import"./PrimaryButton-dad32c8c.js";import"./SecondaryButton-9dac2ac9.js";import"./TextAreaInput-1f3d6fff.js";import"./TextInput-18f9b248.js";import"./index-afc880f2.js";/* empty css                         */function q({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:""});return i("form",{onSubmit:r=>{r.preventDefault(),p(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:i(u,{errors:n,data:o,ShouldMap:m,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{q as default};
