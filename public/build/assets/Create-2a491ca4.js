import{K as n,a as e}from"./app-65f42ba1.js";import u from"./Form-b9a219ca.js";import"./InputError-b9a30257.js";import"./InputLabel-6eb49de3.js";import"./ListBoxPage-72ecfc71.js";import"./transition-1cbcc039.js";import"./keyboard-4cd5d298.js";import"./use-tracked-pointer-edd0f6a7.js";import"./use-resolve-button-type-cf725b17.js";import"./PrimaryButton-2ce27186.js";import"./SecondaryButton-e51d8dcd.js";import"./TextInput-fb94a6d3.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:a,errors:p}=n({value:"",name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("impactValues.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(u,{errors:p,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};
