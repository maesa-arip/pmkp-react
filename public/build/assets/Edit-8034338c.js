import{K as p,r as f,a as s}from"./app-65c3736e.js";import d from"./Form-1bef148c.js";import"./InputError-334fd041.js";import"./InputLabel-81fc7a82.js";import"./PrimaryButton-05530fef.js";import"./SecondaryButton-d9600f9a.js";import"./TextInput-e0e4f64e.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:n,reset:i,errors:m}=p({name:t.name}),u=a=>e(!1),c=a=>{a.preventDefault(),n(route("identificationSources.update",t.id),{data:r,onSuccess:()=>{i(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:c,children:s(d,{errors:m,data:r,setData:o,submit:"Update",closeButton:u})})}export{v as default};