import{K as a,a as e}from"./app-76e0e351.js";import c from"./Form-b754d90f.js";import"./InputError-d92e9b54.js";import"./InputLabel-b8277ba9.js";import"./ListBoxPage-2149dd89.js";import"./transition-289cd6ec.js";import"./keyboard-6d4a7ea9.js";import"./use-tracked-pointer-a897496f.js";import"./use-resolve-button-type-f47630a0.js";import"./PrimaryButton-76f35215.js";import"./SecondaryButton-859ffd96.js";import"./TextInput-587695a3.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:p,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("pics.store"),{data:o,onSuccess:()=>{p(),t(!1)}})},children:e(c,{errors:n,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};
