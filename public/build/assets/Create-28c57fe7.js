import{K as a,a as e}from"./app-40227382.js";import p from"./Form-dc201703.js";import"./InputError-0cf9554f.js";import"./InputLabel-4fdd6287.js";import"./PrimaryButton-ce8a4982.js";import"./SecondaryButton-e376ea20.js";import"./TextAreaInput-919603c2.js";import"./TextInput-70d63fd3.js";function j({setIsOpenAddDialog:t}){const{data:o,setData:s,post:i,reset:m,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),i(route("riskVarieties.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{j as default};
