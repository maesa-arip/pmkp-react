import{K as f,r as b,a}from"./app-066045de.js";import d from"./Form-9c91fe42.js";import"./InputError-73432e43.js";import"./InputLabel-6a5f3b23.js";import"./PrimaryButton-be25e452.js";import"./SecondaryButton-6e973e99.js";import"./TextInput-bc26ca2b.js";import"./TextInputCheckbox-1645fe9e.js";function F({setIsOpenEditDialog:e,model:t,roles:n,setEnabled:x}){const{data:r,setData:o,put:m,reset:i,errors:p}=f({name:t.name}),u=s=>e(!1),c=s=>{s.preventDefault(),m(route("permissions.update",t.id),{data:r,onSuccess:()=>{i(),e(!1)}})};return b.useEffect(()=>{o({...r,name:t.name})},[t]),a("form",{onSubmit:c,children:a(d,{errors:p,data:r,model:t,roles:n,setData:o,submit:"Update",closeButton:u})})}export{F as default};