import{K as _,r as f,a as n}from"./app-99070bf3.js";import g from"./Form-cd4883ba.js";import"./index-5326e9c3.js";import"./use-tracked-pointer-2823345e.js";import"./render-4d0b05d4.js";import"./keyboard-dd7d2e88.js";import"./use-outside-click-78c70104.js";import"./use-tree-walker-167d225f.js";import"./use-controllable-f3dd8b1d.js";import"./transition-84a3249c.js";import"./use-watch-a0a70be4.js";import"./InputError-f1ce5c35.js";import"./InputLabel-c518dc7e.js";import"./PrimaryButton-9dbb8c90.js";import"./SecondaryButton-1f2ed4bc.js";import"./TextInput-fb6ac66c.js";import"./index-62042e2b.js";import"./createClass-1dd8160f.js";import"./defineProperty-741a9c8e.js";function A({setIsOpenEditDialog:r,model:t,ShouldMap:m}){const{data:i,setData:a,put:p,reset:o,errors:s}=_({mutu_indikator_id:t.mutu_indikator_id,tanggal_mutu:t.tanggal_mutu,num:t.num,denum:t.denum,capaian:t.capaian}),c=u=>r(!1),e=u=>{u.preventDefault(),p(route("MutuUnit.update",t.id),{data:i,onSuccess:()=>{o(),r(!1)}})};return f.useEffect(()=>{a({...i,mutu_indikator_id:t.mutu_indikator_id,tanggal_mutu:t.tanggal_mutu,num:t.num,denum:t.denum,capaian:t.capaian})},[t]),n("form",{onSubmit:e,children:n(g,{errors:s,data:i,setData:a,model:t,ShouldMap:m,submit:"Update",closeButton:c})})}export{A as default};
