import{K as n,a as m}from"./app-c16facc7.js";import u from"./Form-a8960f5d.js";import"./InputError-76bbb453.js";import"./InputLabel-512383bf.js";import"./ListBoxPage-88ccca60.js";import"./render-caba555b.js";import"./keyboard-5b6ec9fe.js";import"./use-tracked-pointer-facf5425.js";import"./transition-b189ca49.js";import"./use-resolve-button-type-fefed35d.js";import"./use-outside-click-cb40d2bb.js";import"./use-controllable-c2a49b00.js";import"./PrimaryButton-8f5509fc.js";import"./SecondaryButton-91e71e10.js";import"./TextInput-13418c97.js";function k({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("probabilityValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{k as default};
