import{K as n,a as e}from"./app-066045de.js";import u from"./Form-5cf38f60.js";import"./InputError-73432e43.js";import"./InputLabel-6a5f3b23.js";import"./ListBoxPage-abdd99b8.js";import"./transition-7365e59c.js";import"./keyboard-75d781da.js";import"./use-tracked-pointer-6581d345.js";import"./use-resolve-button-type-b8a26580.js";import"./PrimaryButton-be25e452.js";import"./SecondaryButton-6e973e99.js";import"./TextInput-bc26ca2b.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:a,errors:p}=n({value:"",name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("impactValues.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(u,{errors:p,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};