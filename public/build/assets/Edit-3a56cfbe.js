import{K as c,r as f,a as s}from"./app-40227382.js";import d from"./Form-5493121c.js";import"./InputError-0cf9554f.js";import"./InputLabel-4fdd6287.js";import"./PrimaryButton-ce8a4982.js";import"./SecondaryButton-e376ea20.js";import"./TextInput-70d63fd3.js";function j({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:m,reset:n,errors:p}=c({name:t.name}),i=a=>e(!1),u=a=>{a.preventDefault(),m(route("IkpLokasi.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:u,children:s(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:i})})}export{j as default};
