import{K as n,a as m}from"./app-c54a562f.js";import u from"./Form-4640a1ae.js";import"./InputError-80a9159c.js";import"./InputLabel-c3873a4b.js";import"./ListBoxPage-799765e2.js";import"./render-66fc26f7.js";import"./keyboard-70b1741c.js";import"./use-tracked-pointer-301018c3.js";import"./transition-9c757782.js";import"./use-outside-click-eb6d816f.js";import"./use-controllable-650a6236.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./TextInput-0606da2e.js";function V({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("probabilityValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{V as default};
