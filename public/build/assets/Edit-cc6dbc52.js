import{K as c,r as f,a as s}from"./app-79a2aeb1.js";import d from"./Form-446b056b.js";import"./InputError-478072b5.js";import"./InputLabel-36bde3cd.js";import"./PrimaryButton-0f0abcd4.js";import"./SecondaryButton-04f7f3c9.js";import"./TextInput-4ecdfa12.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:n,reset:m,errors:i}=c({name:t.name}),p=a=>e(!1),u=a=>{a.preventDefault(),n(route("locations.update",t.id),{data:r,onSuccess:()=>{m(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:i,data:r,setData:o,submit:"Update",closeButton:p})})}export{v as default};