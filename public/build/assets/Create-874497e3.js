import{K as a,a as m}from"./app-4dc7e864.js";import u from"./Form-0ff13e29.js";import"./ComboboxPage-ebb481cb.js";import"./use-tracked-pointer-ac86867a.js";import"./render-ea42b304.js";import"./keyboard-84303bfc.js";import"./use-outside-click-a2e1bd03.js";import"./use-tree-walker-f4949a02.js";import"./use-controllable-d514a8f4.js";import"./transition-53d35c05.js";import"./use-watch-579ebb77.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextAreaInput-36efdc5d.js";import"./TextInput-6a3dc504.js";import"./ComboboxMultiple-52cd8efc.js";import"./clsx-8d99dcf0.js";import"./defineProperty-8250cd14.js";function G({setIsOpenAddDialog:t,ShouldMap:i}){const{data:o,setData:p,post:e,reset:s,errors:n}=a({name:""});return m("form",{onSubmit:r=>{r.preventDefault(),e(route("IkpPasien.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:m(u,{errors:n,data:o,ShouldMap:i,setData:p,submit:"Simpan",closeButton:r=>t(!1)})})}export{G as default};