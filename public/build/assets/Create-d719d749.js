import{K as a,a as m}from"./app-4dc7e864.js";import c from"./Form-77561aac.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./ListBoxPage-b610ff7f.js";import"./render-ea42b304.js";import"./keyboard-84303bfc.js";import"./use-tracked-pointer-ac86867a.js";import"./transition-53d35c05.js";import"./use-outside-click-a2e1bd03.js";import"./use-controllable-d514a8f4.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextInput-6a3dc504.js";function q({setIsOpenAddDialog:t,ShouldMap:i}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:"",description:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("pics.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(c,{errors:n,data:o,ShouldMap:i,setData:e,submit:"Simpan",closeButton:r=>t(!1)})})}export{q as default};