import{K as f,r as v,a as o}from"./app-e4099200.js";import y from"./Form-f28997cf.js";import"./InputError-08e5762a.js";import"./InputLabel-1346bb0f.js";import"./ListBoxPage-47edca9e.js";import"./render-8c44965e.js";import"./keyboard-32ee57cb.js";import"./use-tracked-pointer-ed229435.js";import"./transition-5c9fd50b.js";import"./use-outside-click-b48eb3a3.js";import"./use-controllable-9548db27.js";import"./PrimaryButton-01f19056.js";import"./SecondaryButton-f8403748.js";import"./TextInput-23fa1da9.js";function q({setIsOpenEditDialog:e,model:t,ShouldMap:i}){const{data:r,setData:a,put:m,reset:s,errors:u}=f({value:t.value,name:t.name,type:t.type}),n=p=>e(!1),c=p=>{p.preventDefault(),m(route("impactValues.update",t.id),{data:r,onSuccess:()=>{s(),e(!1)}})};return v.useEffect(()=>{a({...r,value:t.value,name:t.name,type:t.type})},[t]),o("form",{onSubmit:c,children:o(y,{errors:u,data:r,model:t,ShouldMap:i,setData:a,submit:"Update",closeButton:n})})}export{q as default};
