import{K as n,a as m}from"./app-99070bf3.js";import u from"./Form-07e67f10.js";import"./InputError-f1ce5c35.js";import"./InputLabel-c518dc7e.js";import"./ListBoxPage-dcc2f352.js";import"./render-4d0b05d4.js";import"./keyboard-dd7d2e88.js";import"./use-tracked-pointer-2823345e.js";import"./transition-84a3249c.js";import"./use-outside-click-78c70104.js";import"./use-controllable-f3dd8b1d.js";import"./PrimaryButton-9dbb8c90.js";import"./SecondaryButton-1f2ed4bc.js";import"./TextInput-fb6ac66c.js";function k({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("controlValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{k as default};
