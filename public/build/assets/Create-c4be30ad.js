import{K as n,a as m}from"./app-d82779ce.js";import u from"./Form-55747f16.js";import"./InputError-059cf2e3.js";import"./InputLabel-22a5e810.js";import"./ListBoxPage-96bdf40f.js";import"./render-89ccdd93.js";import"./keyboard-24953c5a.js";import"./use-tracked-pointer-be6b765d.js";import"./transition-5cadacd4.js";import"./use-outside-click-74538e22.js";import"./use-controllable-b314f4f0.js";import"./PrimaryButton-fee4efee.js";import"./SecondaryButton-26d8c5a1.js";import"./TextInput-45a16e3b.js";function k({setIsOpenAddDialog:t,ShouldMap:e}){const{data:o,setData:i,post:p,reset:s,errors:a}=n({value:"",name:""});return m("form",{onSubmit:r=>{r.preventDefault(),p(route("impactValues.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:a,data:o,ShouldMap:e,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{k as default};
