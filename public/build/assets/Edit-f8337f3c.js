import{K as f,r as d,a as p}from"./app-c54a562f.js";import l from"./Form-c45e0056.js";import"./InputError-80a9159c.js";import"./InputLabel-c3873a4b.js";import"./ListBoxPage-799765e2.js";import"./render-66fc26f7.js";import"./keyboard-70b1741c.js";import"./use-tracked-pointer-301018c3.js";import"./transition-9c757782.js";import"./use-outside-click-eb6d816f.js";import"./use-controllable-650a6236.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./TextInput-0606da2e.js";function q({setIsOpenEditDialog:r,model:t,ShouldMap:e}){const{data:o,setData:i,put:m,reset:n,errors:s}=f({name:t.name,location_id:t.location.id}),c=a=>r(!1),u=a=>{a.preventDefault(),m(route("pics.update",t.id),{data:o,onSuccess:()=>{n(),r(!1)}})};return d.useEffect(()=>{i({...o,name:t.name,location_id:t.location.id})},[t]),p("form",{onSubmit:u,children:p(l,{errors:s,data:o,model:t,ShouldMap:e,setData:i,submit:"Update",closeButton:c})})}export{q as default};