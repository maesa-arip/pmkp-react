import{K as u,r as f,a}from"./app-614c1295.js";import d from"./Form-bbfc08bf.js";import"./InputError-bc96fff5.js";import"./InputLabel-0d6e0d61.js";import"./PrimaryButton-85a5e5df.js";import"./SecondaryButton-abcfa509.js";import"./TextAreaInput-e8f6ce75.js";import"./TextInput-178c6511.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:i,reset:n,errors:p}=u({name:t.name,description:t.description}),m=s=>e(!1),c=s=>{s.preventDefault(),i(route("riskVarieties.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),a("form",{onSubmit:c,children:a(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:m})})}export{v as default};