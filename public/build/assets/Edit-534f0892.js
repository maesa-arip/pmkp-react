import{K as m,r as f,a as o}from"./app-51ace3d0.js";import v from"./Form-b2afd22a.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./PrimaryButton-25f33bf3.js";import"./SecondaryButton-d2b15658.js";import"./TextAreaInput-b5ac16d1.js";import"./TextInput-fe0f0eaf.js";function h({setIsOpenEditDialog:e,model:t}){const{data:r,setData:a,put:s,reset:p,errors:n}=m({value:t.value,name:t.name,description:t.description}),u=i=>e(!1),c=i=>{i.preventDefault(),s(route("IkpDampak.update",t.id),{data:r,onSuccess:()=>{p(),e(!1)}})};return f.useEffect(()=>{a({...r,value:t.value,name:t.name,description:t.description})},[t]),o("form",{onSubmit:c,children:o(v,{errors:n,data:r,setData:a,submit:"Update",closeButton:u})})}export{h as default};