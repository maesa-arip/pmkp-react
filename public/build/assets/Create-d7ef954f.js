import{K as n,a as m}from"./app-de05624d.js";import u from"./Form-1e86a544.js";import"./InputError-8e313441.js";import"./InputLabel-2355428e.js";import"./ListBoxPage-a1f6e3b1.js";import"./render-8340bfb9.js";import"./keyboard-78757131.js";import"./use-tracked-pointer-217e3e28.js";import"./transition-36dfd7b8.js";import"./use-outside-click-b7ca71b6.js";import"./use-controllable-b76a7cef.js";import"./PrimaryButton-cd02b555.js";import"./SecondaryButton-f2f829ff.js";import"./TextInput-5a9d338d.js";function k({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("impactValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{k as default};
