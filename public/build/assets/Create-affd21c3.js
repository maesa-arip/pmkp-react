import{K as n,a as e}from"./app-4dc7e864.js";import p from"./Form-5f5cc655.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextAreaInput-36efdc5d.js";import"./TextInput-6a3dc504.js";function B({setIsOpenAddDialog:t}){const{data:o,setData:m,post:s,reset:a,errors:i}=n({value:"",name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),s(route("IkpDampak.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(p,{errors:i,data:o,setData:m,submit:"Simpan",closeButton:r=>t(!1)})})}export{B as default};