import{K as a,a as e}from"./app-4dc7e864.js";import u from"./Form-c6d2a8e0.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextInput-6a3dc504.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:i,reset:m,errors:n}=a({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),i(route("identificationSources.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(u,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};