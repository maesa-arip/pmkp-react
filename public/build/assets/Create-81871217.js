import{K as a,a as i}from"./app-a515daf2.js";import u from"./Form-256f50f4.js";import"./ComboboxPage-63d67464.js";import"./use-tracked-pointer-a8bedc30.js";import"./transition-4ad8ddf1.js";import"./keyboard-a7eff1f5.js";import"./use-resolve-button-type-3e2bb007.js";import"./use-watch-ba625b59.js";import"./InputError-e663b23a.js";import"./InputLabel-2a3bf0b1.js";import"./PrimaryButton-8cbe1ff8.js";import"./SecondaryButton-f2acca44.js";import"./TextAreaInput-13841cb0.js";import"./TextInput-673b07f1.js";import"./TextInputWithError-e457d1ab.js";/* empty css                         */function q({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:""});return i("form",{onSubmit:r=>{r.preventDefault(),p(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:i(u,{errors:n,data:o,ShouldMap:m,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{q as default};
