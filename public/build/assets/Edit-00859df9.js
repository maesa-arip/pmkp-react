import{K as c,r as f,a as s}from"./app-51ace3d0.js";import d from"./Form-89d997e1.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./PrimaryButton-25f33bf3.js";import"./SecondaryButton-d2b15658.js";import"./TextInput-fe0f0eaf.js";function j({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:m,reset:n,errors:p}=c({name:t.name}),i=a=>e(!1),u=a=>{a.preventDefault(),m(route("IkpLokasi.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:i})})}export{j as default};