import{K as c,r as f,a as s}from"./app-51ace3d0.js";import l from"./Form-0c655f24.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./PrimaryButton-25f33bf3.js";import"./SecondaryButton-d2b15658.js";import"./TextInput-fe0f0eaf.js";function j({setIsOpenEditDialog:a,model:t}){const{data:r,setData:e,put:u,reset:n,errors:i}=c({value:t.value,name:t.name}),p=o=>a(!1),m=o=>{o.preventDefault(),u(route("IkpProbabilitas.update",t.id),{data:r,onSuccess:()=>{n(),a(!1)}})};return f.useEffect(()=>{e({...r,value:t.value,name:t.name})},[t]),s("form",{onSubmit:m,children:s(l,{errors:i,data:r,setData:e,submit:"Update",closeButton:p})})}export{j as default};