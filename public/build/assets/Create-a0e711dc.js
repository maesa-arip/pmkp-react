import{K as i,a as e}from"./app-40227382.js";import p from"./Form-f6c31e51.js";import"./InputError-0cf9554f.js";import"./InputLabel-4fdd6287.js";import"./PrimaryButton-ce8a4982.js";import"./SecondaryButton-e376ea20.js";import"./TextInput-70d63fd3.js";function B({setIsOpenAddDialog:t}){const{data:o,setData:m,post:n,reset:s,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("IkpPenindak.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:e(p,{errors:a,data:o,setData:m,submit:"Simpan",closeButton:r=>t(!1)})})}export{B as default};