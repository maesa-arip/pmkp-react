import{K as a,a as m}from"./app-e63dc518.js";import c from"./Form-fa019545.js";import"./InputError-47496446.js";import"./InputLabel-85eaffe7.js";import"./ListBoxPage-1d69198b.js";import"./render-d70bc49e.js";import"./keyboard-447131b1.js";import"./use-tracked-pointer-b056eebf.js";import"./transition-f8d58bb7.js";import"./use-outside-click-bb6a6fc0.js";import"./use-controllable-a3dfb2af.js";import"./PrimaryButton-0019f275.js";import"./SecondaryButton-eba774a1.js";import"./TextInput-6ffa0885.js";function q({setIsOpenAddDialog:t,ShouldMap:i}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:"",description:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("pics.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(c,{errors:n,data:o,ShouldMap:i,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{q as default};
