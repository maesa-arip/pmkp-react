import{K as f,r as d,a as p}from"./app-de05624d.js";import l from"./Form-6874406c.js";import"./InputError-8e313441.js";import"./InputLabel-2355428e.js";import"./ListBoxPage-a1f6e3b1.js";import"./render-8340bfb9.js";import"./keyboard-78757131.js";import"./use-tracked-pointer-217e3e28.js";import"./transition-36dfd7b8.js";import"./use-outside-click-b7ca71b6.js";import"./use-controllable-b76a7cef.js";import"./PrimaryButton-cd02b555.js";import"./SecondaryButton-f2f829ff.js";import"./TextInput-5a9d338d.js";function q({setIsOpenEditDialog:r,model:t,ShouldMap:e}){const{data:o,setData:i,put:m,reset:n,errors:s}=f({name:t.name,location_id:t.location.id}),c=a=>r(!1),u=a=>{a.preventDefault(),m(route("pics.update",t.id),{data:o,onSuccess:()=>{n(),r(!1)}})};return d.useEffect(()=>{i({...o,name:t.name,location_id:t.location.id})},[t]),p("form",{onSubmit:u,children:p(l,{errors:s,data:o,model:t,ShouldMap:e,setData:i,submit:"Update",closeButton:c})})}export{q as default};