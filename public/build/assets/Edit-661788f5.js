import{K as c,r as f,a as s}from"./app-4dc7e864.js";import d from"./Form-4ac74d1e.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextInput-6a3dc504.js";function k({setIsOpenEditDialog:e,model:t}){const{data:r,setData:o,put:m,reset:n,errors:p}=c({name:t.name}),u=a=>e(!1),i=a=>{a.preventDefault(),m(route("IkpPelapor.update",t.id),{data:r,onSuccess:()=>{n(),e(!1)}})};return f.useEffect(()=>{o({...r,name:t.name})},[t]),s("form",{onSubmit:i,children:s(d,{errors:p,data:r,setData:o,submit:"Update",closeButton:u})})}export{k as default};