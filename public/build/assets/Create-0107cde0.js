import{K as n,a as m}from"./app-4dc7e864.js";import u from"./Form-1255e520.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./ListBoxPage-b610ff7f.js";import"./render-ea42b304.js";import"./keyboard-84303bfc.js";import"./use-tracked-pointer-ac86867a.js";import"./transition-53d35c05.js";import"./use-outside-click-a2e1bd03.js";import"./use-controllable-d514a8f4.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextInput-6a3dc504.js";function k({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("impactValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{k as default};
