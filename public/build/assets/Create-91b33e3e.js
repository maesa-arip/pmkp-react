import{K as p,a as e}from"./app-79a2aeb1.js";import u from"./Form-215c52bc.js";import"./InputError-478072b5.js";import"./InputLabel-36bde3cd.js";import"./ListBoxPage-94af130b.js";import"./transition-9b0aa617.js";import"./keyboard-8e5d6cce.js";import"./use-tracked-pointer-957f2733.js";import"./use-resolve-button-type-ef54f68e.js";import"./PrimaryButton-0f0abcd4.js";import"./SecondaryButton-04f7f3c9.js";import"./TextInput-4ecdfa12.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:a,errors:n}=p({value:"",name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("controlValues.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(u,{errors:n,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};