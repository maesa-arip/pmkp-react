import{K as u,r as f,a}from"./app-1038bb6b.js";import d from"./Form-51510acc.js";import"./InputError-d08426c8.js";import"./InputLabel-02f5d61f.js";import"./PrimaryButton-cf4a4968.js";import"./SecondaryButton-34683c81.js";import"./TextAreaInput-0b26f18f.js";import"./TextInput-a9e4401d.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:i,reset:n,errors:p}=u({name:t.name,description:t.description}),m=s=>e(!1),c=s=>{s.preventDefault(),i(route("riskVarieties.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),a("form",{onSubmit:c,children:a(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:m})})}export{v as default};