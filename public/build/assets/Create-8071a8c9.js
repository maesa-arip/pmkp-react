import{K as i,a as e}from"./app-066045de.js";import p from"./Form-3260eea6.js";import"./InputError-73432e43.js";import"./InputLabel-6a5f3b23.js";import"./PrimaryButton-be25e452.js";import"./SecondaryButton-6e973e99.js";import"./TextInput-bc26ca2b.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:n,reset:m,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("opsiPengendalians.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:a,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};