import{K as n,a as e}from"./app-99ef0eb0.js";import u from"./Form-c24ae8cd.js";import"./InputError-db58d90d.js";import"./InputLabel-7af8523f.js";import"./ListBoxPage-fe198862.js";import"./transition-9c7d8c03.js";import"./keyboard-ae49841d.js";import"./use-tracked-pointer-b0e2e50f.js";import"./use-resolve-button-type-c9292bc7.js";import"./PrimaryButton-41d745e5.js";import"./SecondaryButton-a8193bcc.js";import"./TextInput-2629e86a.js";function F({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:a,errors:p}=n({value:"",name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("probabilityValues.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(u,{errors:p,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{F as default};
