import{K as c,r as f,a as s}from"./app-43246a29.js";import d from"./Form-e860ca3e.js";import"./InputError-8479d924.js";import"./InputLabel-7159db58.js";import"./PrimaryButton-ab57cc3d.js";import"./SecondaryButton-d32e9bed.js";import"./TextInput-e2264539.js";function k({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:n,reset:m,errors:p}=c({name:t.name}),i=a=>e(!1),u=a=>{a.preventDefault(),n(route("IkpTipeInsiden.update",t.id),{data:r,onSuccess:()=>{m(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:i})})}export{k as default};