import{K as f,r as v,a as o}from"./app-83ca3436.js";import y from"./Form-96be4b74.js";import"./InputError-4b48467c.js";import"./InputLabel-25551fe3.js";import"./ListBoxPage-e5f2470d.js";import"./render-86025246.js";import"./keyboard-b62567d2.js";import"./use-tracked-pointer-906c2b6f.js";import"./transition-df44a6c7.js";import"./use-outside-click-8cff4495.js";import"./use-controllable-bb013e4a.js";import"./PrimaryButton-0d637669.js";import"./SecondaryButton-9d49c1ca.js";import"./TextInput-4bde95e6.js";function q({setIsOpenEditDialog:e,model:t,ShouldMap:i}){const{data:r,setData:a,put:s,reset:u,errors:m}=f({value:t.value,name:t.name,type:t.type}),n=p=>e(!1),c=p=>{p.preventDefault(),s(route("probabilityValues.update",t.id),{data:r,onSuccess:()=>{u(),e(!1)}})};return v.useEffect(()=>{a({...r,value:t.value,name:t.name,type:t.type})},[t]),o("form",{onSubmit:c,children:o(y,{errors:m,data:r,model:t,ShouldMap:i,setData:a,submit:"Update",closeButton:n})})}export{q as default};
