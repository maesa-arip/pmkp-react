import{K as f,r as v,a as p}from"./app-d82779ce.js";import y from"./Form-f0500e2d.js";import"./InputError-059cf2e3.js";import"./InputLabel-22a5e810.js";import"./ListBoxPage-96bdf40f.js";import"./render-89ccdd93.js";import"./keyboard-24953c5a.js";import"./use-tracked-pointer-be6b765d.js";import"./transition-5cadacd4.js";import"./use-outside-click-74538e22.js";import"./use-controllable-b314f4f0.js";import"./PrimaryButton-fee4efee.js";import"./SecondaryButton-26d8c5a1.js";import"./TextInput-45a16e3b.js";function q({setIsOpenEditDialog:e,model:t,ShouldMap:i}){const{data:r,setData:a,put:s,reset:u,errors:m}=f({value:t.value,name:t.name,type:t.type}),n=o=>e(!1),c=o=>{o.preventDefault(),s(route("controlValues.update",t.id),{data:r,onSuccess:()=>{u(),e(!1)}})};return v.useEffect(()=>{a({...r,value:t.value,name:t.name,type:t.type})},[t]),p("form",{onSubmit:c,children:p(y,{errors:m,data:r,model:t,ShouldMap:i,setData:a,submit:"Update",closeButton:n})})}export{q as default};
