import{K as f,r as d,a as p}from"./app-3d8ac52b.js";import l from"./Form-963b31a0.js";import"./InputError-edc35217.js";import"./InputLabel-f720277b.js";import"./ListBoxPage-4ce3707e.js";import"./render-78cd80d0.js";import"./keyboard-4075dfde.js";import"./use-tracked-pointer-6490f96e.js";import"./transition-bd4d54e5.js";import"./use-outside-click-9275b5eb.js";import"./use-controllable-5dd44a7d.js";import"./PrimaryButton-7d31ead8.js";import"./SecondaryButton-134a69e8.js";import"./TextInput-a3ae412c.js";function q({setIsOpenEditDialog:r,model:t,ShouldMap:e}){const{data:o,setData:i,put:m,reset:n,errors:s}=f({name:t.name,location_id:t.location.id}),c=a=>r(!1),u=a=>{a.preventDefault(),m(route("pics.update",t.id),{data:o,onSuccess:()=>{n(),r(!1)}})};return d.useEffect(()=>{i({...o,name:t.name,location_id:t.location.id})},[t]),p("form",{onSubmit:u,children:p(l,{errors:s,data:o,model:t,ShouldMap:e,setData:i,submit:"Update",closeButton:c})})}export{q as default};
