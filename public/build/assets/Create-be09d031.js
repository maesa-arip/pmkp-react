import{K as i,a as e}from"./app-4dc7e864.js";import u from"./Form-79bfc9a1.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextInput-6a3dc504.js";function d({setIsOpenAddDialog:t}){const{data:o,setData:n,post:m,reset:s,errors:a}=i({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("IkpPenanggung.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:e(u,{errors:a,data:o,setData:n,submit:"Simpan",closeButton:r=>t(!1)})})}export{d as default};