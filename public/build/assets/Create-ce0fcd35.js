import{K as n,a as m}from"./app-d3d4087f.js";import u from"./Form-a350ff75.js";import"./InputError-6bb1a026.js";import"./InputLabel-ad77c239.js";import"./ListBoxPage-324f3661.js";import"./render-ff084efb.js";import"./keyboard-acb3f7ce.js";import"./use-tracked-pointer-b5bb77a5.js";import"./transition-e3ecd5cc.js";import"./use-outside-click-ed43817d.js";import"./use-controllable-b9490ee0.js";import"./PrimaryButton-588a671c.js";import"./SecondaryButton-b1b12734.js";import"./TextInput-d85a7c80.js";function V({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("probabilityValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{V as default};
