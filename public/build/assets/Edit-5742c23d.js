import{K as f,r as d,a as p}from"./app-83ca3436.js";import l from"./Form-f14ee444.js";import"./InputError-4b48467c.js";import"./InputLabel-25551fe3.js";import"./ListBoxPage-e5f2470d.js";import"./render-86025246.js";import"./keyboard-b62567d2.js";import"./use-tracked-pointer-906c2b6f.js";import"./transition-df44a6c7.js";import"./use-outside-click-8cff4495.js";import"./use-controllable-bb013e4a.js";import"./PrimaryButton-0d637669.js";import"./SecondaryButton-9d49c1ca.js";import"./TextInput-4bde95e6.js";function q({setIsOpenEditDialog:r,model:t,ShouldMap:e}){const{data:o,setData:i,put:m,reset:n,errors:s}=f({name:t.name,location_id:t.location.id}),c=a=>r(!1),u=a=>{a.preventDefault(),m(route("pics.update",t.id),{data:o,onSuccess:()=>{n(),r(!1)}})};return d.useEffect(()=>{i({...o,name:t.name,location_id:t.location.id})},[t]),p("form",{onSubmit:u,children:p(l,{errors:s,data:o,model:t,ShouldMap:e,setData:i,submit:"Update",closeButton:c})})}export{q as default};
