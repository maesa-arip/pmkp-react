import{K as i,a as e}from"./app-43246a29.js";import p from"./Form-c48422fd.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./SecondaryButton-d32e9bed.js";import"./TextInput-e2264539.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:m,post:s,reset:a,errors:n}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("IkpPelapor.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(p,{errors:n,data:o,setData:m,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};