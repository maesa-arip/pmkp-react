import{K as u,r as f,a}from"./app-12155d7d.js";import b from"./Form-46c988b2.js";import"./InputError-b39280a0.js";import"./InputLabel-a6ff48db.js";import"./PrimaryButton-bf4695c7.js";import"./SecondaryButton-456a1177.js";import"./TextAreaInput-fc20fc43.js";import"./TextInput-d440a1d3.js";function B({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:i,reset:n,errors:p}=u({name:t.name,description:t.description}),m=s=>e(!1),c=s=>{s.preventDefault(),i(route("jenisSebabs.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),a("form",{onSubmit:c,children:a(b,{errors:p,data:r,setData:o,submit:"Update",closeButton:m})})}export{B as default};