import{K as a,a as m}from"./app-57abeb7f.js";import u from"./Form-39790387.js";import"./ComboboxPage-94a3c038.js";import"./index-096dd8d1.js";import"./use-tracked-pointer-49162435.js";import"./render-03fd2506.js";import"./keyboard-fa766a3d.js";import"./use-outside-click-442a3422.js";import"./use-tree-walker-df042132.js";import"./use-controllable-d69111b2.js";import"./transition-93ae57c5.js";import"./use-watch-403218a7.js";import"./InputError-2875e4e2.js";import"./InputLabel-3abb9057.js";import"./PrimaryButton-d928be8d.js";import"./SecondaryButton-fc8ffef9.js";import"./TextInput-ca6ef7c6.js";function y({setIsOpenAddDialog:t,ShouldMap:i}){const{data:o,setData:e,post:p,reset:s,errors:n}=a({name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("MutuIndikator.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:n,data:o,setData:e,ShouldMap:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{y as default};
