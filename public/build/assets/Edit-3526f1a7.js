import{K as f,r as d,a as e}from"./app-fb0ca47c.js";import l from"./Form-0e5ff9bf.js";import"./InputError-c61e77eb.js";import"./InputLabel-4fbe5877.js";import"./ListBoxPage-8307d2ab.js";import"./transition-a3f5f00e.js";import"./keyboard-df5676be.js";import"./use-tracked-pointer-8da19b30.js";import"./use-resolve-button-type-975eebc9.js";import"./PrimaryButton-fb4d2294.js";import"./SecondaryButton-16634938.js";import"./TextInput-55e253d3.js";function U({setIsOpenEditDialog:r,model:t,ShouldMap:n}){const{data:o,setData:i,put:p,reset:s,errors:m}=f({name:t.name,location_id:t.location.id}),c=a=>r(!1),u=a=>{a.preventDefault(),p(route("pics.update",t.id),{data:o,onSuccess:()=>{s(),r(!1)}})};return d.useEffect(()=>{i({...o,name:t.name,location_id:t.location.id})},[t]),e("form",{onSubmit:u,children:e(l,{errors:m,data:o,model:t,ShouldMap:n,setData:i,submit:"Update",closeButton:c})})}export{U as default};
