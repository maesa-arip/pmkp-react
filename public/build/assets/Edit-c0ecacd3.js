import{K as c,r as f,a as s}from"./app-12155d7d.js";import d from"./Form-52a36457.js";import"./InputError-b39280a0.js";import"./InputLabel-a6ff48db.js";import"./PrimaryButton-bf4695c7.js";import"./SecondaryButton-456a1177.js";import"./TextInput-d440a1d3.js";function k({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:m,reset:n,errors:p}=c({name:t.name}),i=a=>e(!1),u=a=>{a.preventDefault(),m(route("riskTypes.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:i})})}export{k as default};