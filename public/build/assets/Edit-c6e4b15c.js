import{K as c,r as f,a as s}from"./app-12155d7d.js";import d from"./Form-442bbaef.js";import"./InputError-b39280a0.js";import"./InputLabel-a6ff48db.js";import"./PrimaryButton-bf4695c7.js";import"./SecondaryButton-456a1177.js";import"./TextInput-d440a1d3.js";function k({setIsOpenEditDialog:e,model:t}){const{data:r,setData:a,put:i,reset:m,errors:n}=c({name:t.name}),p=o=>e(!1),u=o=>{o.preventDefault(),i(route("IkpSpesialisasi.update",t.id),{data:r,onSuccess:()=>{m(),e(!1)}})};return f.useEffect(()=>{a({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:n,data:r,setData:a,submit:"Update",closeButton:p})})}export{k as default};