import{K as c,r as f,a as s}from"./app-de05624d.js";import d from"./Form-201a7a65.js";import"./InputError-8e313441.js";import"./InputLabel-2355428e.js";import"./PrimaryButton-cd02b555.js";import"./SecondaryButton-f2f829ff.js";import"./TextInput-5a9d338d.js";function k({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:m,reset:n,errors:p}=c({name:t.name}),u=a=>e(!1),i=a=>{a.preventDefault(),m(route("IkpPelapor.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:i,children:s(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:u})})}export{k as default};