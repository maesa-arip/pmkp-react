import{K as a,a as e}from"./app-614c1295.js";import p from"./Form-bbfc08bf.js";import"./InputError-bc96fff5.js";import"./InputLabel-0d6e0d61.js";import"./PrimaryButton-85a5e5df.js";import"./SecondaryButton-abcfa509.js";import"./TextAreaInput-e8f6ce75.js";import"./TextInput-178c6511.js";function j({setIsOpenAddDialog:t}){const{data:o,setData:s,post:i,reset:m,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),i(route("riskVarieties.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{j as default};