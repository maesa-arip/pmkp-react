import{K as p,r as f,a as s}from"./app-c16facc7.js";import d from"./Form-050857ab.js";import"./InputError-76bbb453.js";import"./InputLabel-512383bf.js";import"./PrimaryButton-8f5509fc.js";import"./SecondaryButton-91e71e10.js";import"./TextInput-13418c97.js";function v({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:n,reset:i,errors:m}=p({name:t.name}),u=a=>e(!1),c=a=>{a.preventDefault(),n(route("identificationSources.update",t.id),{data:r,onSuccess:()=>{i(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:c,children:s(d,{errors:m,data:r,setData:o,submit:"Update",closeButton:u})})}export{v as default};