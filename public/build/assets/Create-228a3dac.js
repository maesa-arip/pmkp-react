import{K as i,a as e}from"./app-c54a562f.js";import p from"./Form-f3db275f.js";import"./InputError-80a9159c.js";import"./InputLabel-c3873a4b.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./TextInput-0606da2e.js";function B({setIsOpenAddDialog:t}){const{data:o,setData:m,post:n,reset:s,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("IkpPenindak.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:e(p,{errors:a,data:o,setData:m,submit:"Simpan",closeButton:r=>t(!1)})})}export{B as default};