import{K as c,r as f,a as s}from"./app-1038bb6b.js";import d from"./Form-fc3f5242.js";import"./InputError-d08426c8.js";import"./InputLabel-02f5d61f.js";import"./PrimaryButton-cf4a4968.js";import"./SecondaryButton-34683c81.js";import"./TextInput-a9e4401d.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:n,reset:m,errors:i}=c({name:t.name}),p=a=>e(!1),u=a=>{a.preventDefault(),n(route("locations.update",t.id),{data:r,onSuccess:()=>{m(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:i,data:r,setData:o,submit:"Update",closeButton:p})})}export{v as default};