import{K as n,a as e}from"./app-2bf39a84.js";import u from"./Form-572a8737.js";import"./InputError-33f8a1b5.js";import"./InputLabel-0e923cdb.js";import"./ListBoxPage-b5ccf8d4.js";import"./transition-c5bf2c10.js";import"./keyboard-be4382e6.js";import"./use-tracked-pointer-e3385313.js";import"./use-resolve-button-type-ab10262b.js";import"./PrimaryButton-0d458c5a.js";import"./SecondaryButton-e4da5bbe.js";import"./TextInput-5bea8677.js";function K({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:i,post:s,reset:a,errors:p}=n({value:"",name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("impactValues.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(u,{errors:p,data:o,ShouldMap:m,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{K as default};
