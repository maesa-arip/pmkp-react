import{K as d,r as c,a as n}from"./app-c54a562f.js";import f from"./Form-92a4950e.js";import"./ComboboxPage-44137921.js";import"./index-888b2fed.js";import"./use-tracked-pointer-301018c3.js";import"./render-66fc26f7.js";import"./keyboard-70b1741c.js";import"./use-outside-click-eb6d816f.js";import"./use-tree-walker-30f59ca8.js";import"./use-controllable-650a6236.js";import"./transition-9c757782.js";import"./use-watch-b3d15d4e.js";import"./InputError-80a9159c.js";import"./InputLabel-c3873a4b.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./TextInput-0606da2e.js";function y({setIsOpenEditDialog:i,model:t,ShouldMap:u}){const{data:r,setData:a,put:_,reset:m,errors:p}=d({indikator_fitur4_id:t.indikator_fitur4_id,mutu_kategori_id:t.mutu_kategori_id,location_id:t.location_id,num_name:t.num_name,denum_name:t.denum_name,operator:t.operator,standar:t.standar}),e=o=>i(!1),s=o=>{o.preventDefault(),_(route("MutuIndikator.update",t.id),{data:r,onSuccess:()=>{m(),i(!1)}})};return c.useEffect(()=>{a({...r,indikator_fitur4_id:t.indikator_fitur4_id,mutu_kategori_id:t.mutu_kategori_id,location_id:t.location_id,num_name:t.num_name,denum_name:t.denum_name,operator:t.operator,standar:t.standar})},[t]),n("form",{onSubmit:s,children:n(f,{errors:p,data:r,setData:a,model:t,ShouldMap:u,submit:"Update",closeButton:e})})}export{y as default};