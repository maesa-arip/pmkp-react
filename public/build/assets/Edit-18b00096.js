import{K as f,r as v,a as o}from"./app-2fe6b77c.js";import y from"./Form-44e213d9.js";import"./InputError-8b04bcb9.js";import"./InputLabel-9730e1e9.js";import"./ListBoxPage-31047b9d.js";import"./render-5abf3d85.js";import"./keyboard-0d1edd6a.js";import"./use-tracked-pointer-4b635f7a.js";import"./transition-5b3e3f05.js";import"./use-outside-click-77d3e5d1.js";import"./use-controllable-0e1719e7.js";import"./PrimaryButton-055b76ad.js";import"./SecondaryButton-3b043a27.js";import"./TextInput-ab47e367.js";function q({setIsOpenEditDialog:e,model:t,ShouldMap:i}){const{data:r,setData:a,put:s,reset:u,errors:m}=f({value:t.value,name:t.name,type:t.type}),n=p=>e(!1),c=p=>{p.preventDefault(),s(route("probabilityValues.update",t.id),{data:r,onSuccess:()=>{u(),e(!1)}})};return v.useEffect(()=>{a({...r,value:t.value,name:t.name,type:t.type})},[t]),o("form",{onSubmit:c,children:o(y,{errors:m,data:r,model:t,ShouldMap:i,setData:a,submit:"Update",closeButton:n})})}export{q as default};
