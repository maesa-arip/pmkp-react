import{K as u,r as f,a}from"./app-c54a562f.js";import b from"./Form-258288fe.js";import"./InputError-80a9159c.js";import"./InputLabel-c3873a4b.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./TextAreaInput-2720a1db.js";import"./TextInput-0606da2e.js";function B({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:i,reset:n,errors:p}=u({name:t.name,description:t.description}),m=s=>e(!1),c=s=>{s.preventDefault(),i(route("jenisSebabs.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),a("form",{onSubmit:c,children:a(b,{errors:p,data:r,setData:o,submit:"Update",closeButton:m})})}export{B as default};