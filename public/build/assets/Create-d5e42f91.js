import{K as a,a as e}from"./app-0da779d6.js";import c from"./Form-41db473d.js";import"./InputError-634add90.js";import"./InputLabel-d00fdff0.js";import"./ListBoxPage-5197d367.js";import"./transition-d3118cc9.js";import"./keyboard-3e1eb91c.js";import"./use-tracked-pointer-f547c941.js";import"./use-resolve-button-type-118bc16a.js";import"./PrimaryButton-a3bfa6c9.js";import"./SecondaryButton-29c22d18.js";import"./TextInput-69f4b767.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:p,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("pics.store"),{data:o,onSuccess:()=>{p(),t(!1)}})},children:e(c,{errors:n,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};
