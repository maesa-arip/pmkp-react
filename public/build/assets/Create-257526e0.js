import{K as i,a as e}from"./app-e63dc518.js";import u from"./Form-fbe49d6e.js";import"./InputError-47496446.js";import"./InputLabel-85eaffe7.js";import"./PrimaryButton-0019f275.js";import"./SecondaryButton-eba774a1.js";import"./TextInput-6ffa0885.js";function d({setIsOpenAddDialog:t}){const{data:o,setData:n,post:m,reset:s,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("IkpPenanggung.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:e(u,{errors:a,data:o,setData:n,submit:"Simpan",closeButton:r=>t(!1)})})}export{d as default};