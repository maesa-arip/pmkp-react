import{K as _,r as f,a as n}from"./app-e4099200.js";import g from"./Form-f7631f51.js";import"./index-34b16df4.js";import"./use-tracked-pointer-ed229435.js";import"./render-8c44965e.js";import"./keyboard-32ee57cb.js";import"./use-outside-click-b48eb3a3.js";import"./use-tree-walker-622b50a8.js";import"./use-controllable-9548db27.js";import"./transition-5c9fd50b.js";import"./use-watch-98553e18.js";import"./InputError-08e5762a.js";import"./InputLabel-1346bb0f.js";import"./PrimaryButton-01f19056.js";import"./SecondaryButton-f8403748.js";import"./TextInput-23fa1da9.js";import"./index-2b80ace9.js";import"./createClass-1dd8160f.js";import"./defineProperty-741a9c8e.js";function A({setIsOpenEditDialog:r,model:t,ShouldMap:m}){const{data:i,setData:a,put:p,reset:o,errors:s}=_({mutu_indikator_id:t.mutu_indikator_id,tanggal_mutu:t.tanggal_mutu,num:t.num,denum:t.denum,capaian:t.capaian}),c=u=>r(!1),e=u=>{u.preventDefault(),p(route("MutuUnit.update",t.id),{data:i,onSuccess:()=>{o(),r(!1)}})};return f.useEffect(()=>{a({...i,mutu_indikator_id:t.mutu_indikator_id,tanggal_mutu:t.tanggal_mutu,num:t.num,denum:t.denum,capaian:t.capaian})},[t]),n("form",{onSubmit:e,children:n(g,{errors:s,data:i,setData:a,model:t,ShouldMap:m,submit:"Update",closeButton:c})})}export{A as default};
