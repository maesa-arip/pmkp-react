import{K as c,r as f,a as s}from"./app-2bf39a84.js";import d from"./Form-faad25db.js";import"./InputError-33f8a1b5.js";import"./InputLabel-0e923cdb.js";import"./PrimaryButton-0d458c5a.js";import"./SecondaryButton-e4da5bbe.js";import"./TextInput-5bea8677.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:a,put:n,reset:m,errors:i}=c({name:t.name}),p=o=>e(!1),u=o=>{o.preventDefault(),n(route("opsiPengendalians.update",t.id),{data:r,onSuccess:()=>{m(),e(!1)}})};return f.useEffect(()=>{a({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:i,data:r,setData:a,submit:"Update",closeButton:p})})}export{v as default};