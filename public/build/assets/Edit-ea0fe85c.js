import{K as f,r as w,a as o}from"./app-12155d7d.js";import b from"./Form-4f0c34bc.js";import"./InputError-b39280a0.js";import"./InputLabel-a6ff48db.js";import"./PrimaryButton-bf4695c7.js";import"./SecondaryButton-456a1177.js";import"./TextInput-d440a1d3.js";import"./TextInputCheckbox-1e7f9a70.js";function D({setIsOpenEditDialog:a,model:t,roles:p,setEnabled:d}){const{data:r,setData:s,put:i,reset:n,errors:m}=f({name:t.name,email:t.email,password:t.password}),u=e=>a(!1),c=e=>{e.preventDefault(),i(route("users.update",t.id),{data:r,onSuccess:()=>{n(),a(!1)}})};return w.useEffect(()=>{s({...r,name:t.name,email:t.email,password:t.password})},[t]),o("form",{onSubmit:c,children:o(b,{errors:m,data:r,model:t,roles:p,setData:s,submit:"Update",closeButton:u})})}export{D as default};