import{K as n,a as e}from"./app-1038bb6b.js";import u from"./Form-6b1e4ba4.js";import"./InputError-d08426c8.js";import"./InputLabel-02f5d61f.js";import"./PrimaryButton-cf4a4968.js";import"./SecondaryButton-34683c81.js";import"./TextInput-a9e4401d.js";function d({setIsOpenAddDialog:t}){const{data:o,setData:s,post:m,reset:a,errors:i}=n({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),m(route("riskCategories.store"),{data:o,onSuccess:()=>{a(),t(!1)}})},children:e(u,{errors:i,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{d as default};