import{K as n,a as e}from"./app-65a84a67.js";import u from"./Form-4614475e.js";import"./InputError-9ea6194b.js";import"./InputLabel-7e55820d.js";import"./ListBoxPage-ed183a26.js";import"./transition-c0977515.js";import"./keyboard-9d3148c6.js";import"./use-tracked-pointer-80a63ff7.js";import"./use-resolve-button-type-84594a97.js";import"./PrimaryButton-dad32c8c.js";import"./SecondaryButton-9dac2ac9.js";import"./TextInput-18f9b248.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:a,errors:p}=n({value:"",name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("impactValues.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(u,{errors:p,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};
