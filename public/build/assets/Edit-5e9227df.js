import{K as f,r as v,a as o}from"./app-1038bb6b.js";import y from"./Form-63af5932.js";import"./InputError-d08426c8.js";import"./InputLabel-02f5d61f.js";import"./ListBoxPage-633b63ee.js";import"./render-b9239f49.js";import"./keyboard-35feee05.js";import"./use-tracked-pointer-d406b65d.js";import"./transition-2b01b312.js";import"./use-resolve-button-type-3fab24d6.js";import"./use-outside-click-e43918be.js";import"./use-controllable-a34d8bb0.js";import"./PrimaryButton-cf4a4968.js";import"./SecondaryButton-34683c81.js";import"./TextInput-a9e4401d.js";function w({setIsOpenEditDialog:e,model:t,ShouldMap:i}){const{data:r,setData:p,put:m,reset:s,errors:u}=f({value:t.value,name:t.name,type:t.type}),n=a=>e(!1),c=a=>{a.preventDefault(),m(route("probabilityValues.update",t.id),{data:r,onSuccess:()=>{s(),e(!1)}})};return v.useEffect(()=>{p({...r,value:t.value,name:t.name,type:t.type})},[t]),o("form",{onSubmit:c,children:o(y,{errors:u,data:r,model:t,ShouldMap:i,setData:p,submit:"Update",closeButton:n})})}export{w as default};
