import{K as u,r as f,a}from"./app-51ace3d0.js";import d from"./Form-96fe548a.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./PrimaryButton-25f33bf3.js";import"./SecondaryButton-d2b15658.js";import"./TextAreaInput-b5ac16d1.js";import"./TextInput-fe0f0eaf.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:i,reset:n,errors:p}=u({name:t.name,description:t.description}),m=s=>e(!1),c=s=>{s.preventDefault(),i(route("riskVarieties.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),a("form",{onSubmit:c,children:a(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:m})})}export{v as default};