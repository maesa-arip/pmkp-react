import{K as a,a as e}from"./app-43246a29.js";import p from"./Form-ddfed775.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./SecondaryButton-d32e9bed.js";import"./TextAreaInput-1926018e.js";import"./TextInput-e2264539.js";function j({setIsOpenAddDialog:t}){const{data:o,setData:s,post:i,reset:m,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),i(route("riskVarieties.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{j as default};
