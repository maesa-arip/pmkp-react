import{K as i,a as e}from"./app-2bf39a84.js";import p from"./Form-faad25db.js";import"./InputError-33f8a1b5.js";import"./InputLabel-0e923cdb.js";import"./PrimaryButton-0d458c5a.js";import"./SecondaryButton-e4da5bbe.js";import"./TextInput-5bea8677.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:n,reset:m,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("opsiPengendalians.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:a,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};