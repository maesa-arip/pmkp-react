import{K as c,r as f,a as s}from"./app-76e0e351.js";import d from"./Form-b402839a.js";import"./InputError-d92e9b54.js";import"./InputLabel-b8277ba9.js";import"./PrimaryButton-76f35215.js";import"./SecondaryButton-859ffd96.js";import"./TextInput-587695a3.js";function k({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:m,reset:n,errors:i}=c({name:t.name}),p=a=>e(!1),u=a=>{a.preventDefault(),m(route("riskCategories.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:i,data:r,setData:o,submit:"Update",closeButton:p})})}export{k as default};