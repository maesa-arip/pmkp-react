import{K as m,r as f,a as o}from"./app-43246a29.js";import v from"./Form-b5e6c5f9.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./SecondaryButton-d32e9bed.js";import"./TextAreaInput-1926018e.js";import"./TextInput-e2264539.js";function h({setIsOpenEditDialog:e,model:t}){const{data:r,setData:a,put:s,reset:p,errors:n}=m({value:t.value,name:t.name,description:t.description}),u=i=>e(!1),c=i=>{i.preventDefault(),s(route("IkpDampak.update",t.id),{data:r,onSuccess:()=>{p(),e(!1)}})};return f.useEffect(()=>{a({...r,value:t.value,name:t.name,description:t.description})},[t]),o("form",{onSubmit:c,children:o(v,{errors:n,data:r,setData:a,submit:"Update",closeButton:u})})}export{h as default};