import{K as f,r as v,a as o}from"./app-51ace3d0.js";import y from"./Form-7185d391.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./ListBoxPage-33f151f2.js";import"./render-4c1b6d6f.js";import"./keyboard-5d080c87.js";import"./use-tracked-pointer-6f4e190f.js";import"./transition-df8dfa7f.js";import"./use-outside-click-649629ab.js";import"./use-controllable-b6d2b5ff.js";import"./PrimaryButton-25f33bf3.js";import"./SecondaryButton-d2b15658.js";import"./TextInput-fe0f0eaf.js";function q({setIsOpenEditDialog:e,model:t,ShouldMap:i}){const{data:r,setData:a,put:m,reset:s,errors:u}=f({value:t.value,name:t.name,type:t.type}),n=p=>e(!1),c=p=>{p.preventDefault(),m(route("impactValues.update",t.id),{data:r,onSuccess:()=>{s(),e(!1)}})};return v.useEffect(()=>{a({...r,value:t.value,name:t.name,type:t.type})},[t]),o("form",{onSubmit:c,children:o(y,{errors:u,data:r,model:t,ShouldMap:i,setData:a,submit:"Update",closeButton:n})})}export{q as default};