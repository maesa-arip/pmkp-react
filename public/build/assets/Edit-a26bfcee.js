import{K as f,r as v,a as o}from"./app-d3d4087f.js";import y from"./Form-5458cf60.js";import"./InputError-6bb1a026.js";import"./InputLabel-ad77c239.js";import"./ListBoxPage-324f3661.js";import"./render-ff084efb.js";import"./keyboard-acb3f7ce.js";import"./use-tracked-pointer-b5bb77a5.js";import"./transition-e3ecd5cc.js";import"./use-outside-click-ed43817d.js";import"./use-controllable-b9490ee0.js";import"./PrimaryButton-588a671c.js";import"./SecondaryButton-b1b12734.js";import"./TextInput-d85a7c80.js";function q({setIsOpenEditDialog:e,model:t,ShouldMap:i}){const{data:r,setData:a,put:m,reset:s,errors:u}=f({value:t.value,name:t.name,type:t.type}),n=p=>e(!1),c=p=>{p.preventDefault(),m(route("impactValues.update",t.id),{data:r,onSuccess:()=>{s(),e(!1)}})};return v.useEffect(()=>{a({...r,value:t.value,name:t.name,type:t.type})},[t]),o("form",{onSubmit:c,children:o(y,{errors:u,data:r,model:t,ShouldMap:i,setData:a,submit:"Update",closeButton:n})})}export{q as default};
