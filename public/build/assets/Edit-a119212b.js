import{K as f,r as w,a as o}from"./app-e63dc518.js";import b from"./Form-ad240d2a.js";import"./InputError-47496446.js";import"./InputLabel-85eaffe7.js";import"./PrimaryButton-0019f275.js";import"./SecondaryButton-eba774a1.js";import"./TextInput-6ffa0885.js";import"./TextInputCheckbox-5329177f.js";function D({setIsOpenEditDialog:a,model:t,permissions:p,setEnabled:d}){const{data:r,setData:s,put:i,reset:n,errors:m}=f({name:t.name,email:t.email,password:t.password}),u=e=>a(!1),c=e=>{e.preventDefault(),i(route("roles.update",t.id),{data:r,onSuccess:()=>{n(),a(!1)}})};return w.useEffect(()=>{s({...r,name:t.name,email:t.email,password:t.password})},[t]),o("form",{onSubmit:c,children:o(b,{errors:m,data:r,model:t,permissions:p,setData:s,submit:"Update",closeButton:u})})}export{D as default};