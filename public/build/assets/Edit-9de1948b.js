import{K as p,r as f,a as s}from"./app-79a2aeb1.js";import d from"./Form-b9d5f1f1.js";import"./InputError-478072b5.js";import"./InputLabel-36bde3cd.js";import"./PrimaryButton-0f0abcd4.js";import"./SecondaryButton-04f7f3c9.js";import"./TextInput-4ecdfa12.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:n,reset:i,errors:m}=p({name:t.name}),u=a=>e(!1),c=a=>{a.preventDefault(),n(route("identificationSources.update",t.id),{data:r,onSuccess:()=>{i(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:c,children:s(d,{errors:m,data:r,setData:o,submit:"Update",closeButton:u})})}export{v as default};