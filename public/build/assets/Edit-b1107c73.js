import{K as d,r as c,a as n}from"./app-51ace3d0.js";import f from"./Form-0fc75a40.js";import"./ComboboxPage-307ec1ef.js";import"./index-80b734b2.js";import"./use-tracked-pointer-6f4e190f.js";import"./render-4c1b6d6f.js";import"./keyboard-5d080c87.js";import"./use-outside-click-649629ab.js";import"./use-tree-walker-6d933456.js";import"./use-controllable-b6d2b5ff.js";import"./transition-df8dfa7f.js";import"./use-watch-a2bba6b2.js";import"./InputError-a00db705.js";import"./InputLabel-e2db3590.js";import"./PrimaryButton-25f33bf3.js";import"./SecondaryButton-d2b15658.js";import"./TextInput-fe0f0eaf.js";function y({setIsOpenEditDialog:i,model:t,ShouldMap:u}){const{data:r,setData:a,put:_,reset:m,errors:p}=d({indikator_fitur4_id:t.indikator_fitur4_id,mutu_kategori_id:t.mutu_kategori_id,location_id:t.location_id,num_name:t.num_name,denum_name:t.denum_name,operator:t.operator,standar:t.standar}),e=o=>i(!1),s=o=>{o.preventDefault(),_(route("MutuIndikator.update",t.id),{data:r,onSuccess:()=>{m(),i(!1)}})};return c.useEffect(()=>{a({...r,indikator_fitur4_id:t.indikator_fitur4_id,mutu_kategori_id:t.mutu_kategori_id,location_id:t.location_id,num_name:t.num_name,denum_name:t.denum_name,operator:t.operator,standar:t.standar})},[t]),n("form",{onSubmit:s,children:n(f,{errors:p,data:r,setData:a,model:t,ShouldMap:u,submit:"Update",closeButton:e})})}export{y as default};