import{K as a,a as e}from"./app-328e0f8e.js";import c from"./Form-50d55985.js";import"./InputError-16a32d13.js";import"./InputLabel-1153ad76.js";import"./ListBoxPage-6ae3fbbd.js";import"./transition-90c5a8ba.js";import"./keyboard-8a4d4b85.js";import"./use-tracked-pointer-e8e71668.js";import"./use-resolve-button-type-254d59e3.js";import"./PrimaryButton-6b634f27.js";import"./SecondaryButton-8a1eb959.js";import"./TextInput-30771dd1.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:p,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("pics.store"),{data:o,onSuccess:()=>{p(),t(!1)}})},children:e(c,{errors:n,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};
