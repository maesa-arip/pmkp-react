import{K as u,r as f,a}from"./app-79a2aeb1.js";import d from"./Form-ee5961d1.js";import"./InputError-478072b5.js";import"./InputLabel-36bde3cd.js";import"./PrimaryButton-0f0abcd4.js";import"./SecondaryButton-04f7f3c9.js";import"./TextAreaInput-bf6794ab.js";import"./TextInput-4ecdfa12.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:i,reset:n,errors:p}=u({name:t.name,description:t.description}),m=s=>e(!1),c=s=>{s.preventDefault(),i(route("riskVarieties.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),a("form",{onSubmit:c,children:a(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:m})})}export{v as default};