import{K as n,a as m}from"./app-e63dc518.js";import u from"./Form-ff4d511e.js";import"./InputError-47496446.js";import"./InputLabel-85eaffe7.js";import"./ListBoxPage-1d69198b.js";import"./render-d70bc49e.js";import"./keyboard-447131b1.js";import"./use-tracked-pointer-b056eebf.js";import"./transition-f8d58bb7.js";import"./use-outside-click-bb6a6fc0.js";import"./use-controllable-a3dfb2af.js";import"./PrimaryButton-0019f275.js";import"./SecondaryButton-eba774a1.js";import"./TextInput-6ffa0885.js";function V({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("probabilityValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{V as default};
