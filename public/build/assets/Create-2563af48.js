import{K as a,a as i}from"./app-e63dc518.js";import u from"./Form-b2651280.js";import"./ComboboxPage-b6ce5bc8.js";import"./use-tracked-pointer-b056eebf.js";import"./render-d70bc49e.js";import"./keyboard-447131b1.js";import"./use-outside-click-bb6a6fc0.js";import"./use-tree-walker-217dc56f.js";import"./use-controllable-a3dfb2af.js";import"./transition-f8d58bb7.js";import"./use-watch-8712103b.js";import"./InputError-47496446.js";import"./InputLabel-85eaffe7.js";import"./PrimaryButton-0019f275.js";import"./SecondaryButton-eba774a1.js";import"./TextAreaInput-67513412.js";import"./TextInput-6ffa0885.js";import"./TextInputWithError-df44a59b.js";/* empty css                         */function z({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:""});return i("form",{onSubmit:r=>{r.preventDefault(),p(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:i(u,{errors:n,data:o,ShouldMap:m,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{z as default};