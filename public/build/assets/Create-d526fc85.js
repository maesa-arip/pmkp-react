import{K as a,a as m}from"./app-99070bf3.js";import c from"./Form-e60e38f8.js";import"./InputError-f1ce5c35.js";import"./InputLabel-c518dc7e.js";import"./ListBoxPage-dcc2f352.js";import"./render-4d0b05d4.js";import"./keyboard-dd7d2e88.js";import"./use-tracked-pointer-2823345e.js";import"./transition-84a3249c.js";import"./use-outside-click-78c70104.js";import"./use-controllable-f3dd8b1d.js";import"./PrimaryButton-9dbb8c90.js";import"./SecondaryButton-1f2ed4bc.js";import"./TextInput-fb6ac66c.js";function q({setIsOpenAddDialog:t,ShouldMap:i}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:"",description:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("pics.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(c,{errors:n,data:o,ShouldMap:i,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{q as default};
