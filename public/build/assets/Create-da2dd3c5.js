import{K as i,a as e}from"./app-614c1295.js";import p from"./Form-e3517bd8.js";import"./InputError-bc96fff5.js";import"./InputLabel-0d6e0d61.js";import"./PrimaryButton-85a5e5df.js";import"./SecondaryButton-abcfa509.js";import"./TextInput-178c6511.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:m,reset:n,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("riskTypes.store"),{data:o,onSuccess:()=>{n(),t(!1)}})},children:e(p,{errors:a,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};