import{K as c,r as f,a as n}from"./app-51ace3d0.js";import d from"./Form-0debf0fe.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./PrimaryButton-25f33bf3.js";import"./SecondaryButton-d2b15658.js";import"./TextInput-fe0f0eaf.js";function j({setIsOpenEditDialog:e,model:t}){const{data:r,setData:a,put:s,reset:m,errors:p}=c({name:t.name}),u=o=>e(!1),i=o=>{o.preventDefault(),s(route("IkpPenanggung.update",t.id),{data:r,onSuccess:()=>{m(),e(!1)}})};return f.useEffect(()=>{a({...r,name:t.name})},[t]),n("form",{onSubmit:i,children:n(d,{errors:p,data:r,setData:a,submit:"Update",closeButton:u})})}export{j as default};