import{K as a,a as i}from"./app-4dc7e864.js";import u from"./Form-ce5c8401.js";import"./AnimatedMulti-6a2e3946.js";import"./clsx-8d99dcf0.js";import"./defineProperty-8250cd14.js";import"./ComboboxMultiple-52cd8efc.js";import"./ComboboxPage-ebb481cb.js";import"./use-tracked-pointer-ac86867a.js";import"./render-ea42b304.js";import"./keyboard-84303bfc.js";import"./use-outside-click-a2e1bd03.js";import"./use-tree-walker-f4949a02.js";import"./use-controllable-d514a8f4.js";import"./transition-53d35c05.js";import"./use-watch-579ebb77.js";import"./ComboboxPageReadonly-4c0e8fe8.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./RadioCard-802c469a.js";import"./description-72675574.js";import"./SecondaryButton-616e52dd.js";import"./TextAreaInput-36efdc5d.js";import"./TextInput-6a3dc504.js";import"./TextInputWithError-cb45040b.js";import"./index-68480d34.js";/* empty css                         */function P({setIsOpenAddDialog:t,ShouldMap:m}){const{data:o,setData:p,post:e,reset:s,errors:n}=a({name:""});return i("form",{onSubmit:r=>{r.preventDefault(),e(route("riskRegisterKlinis.store"),{data:o,onSuccess:()=>{s(),t(!1)}})},children:i(u,{errors:n,data:o,ShouldMap:m,setData:p,submit:"Simpan",closeButton:r=>t(!1)})})}export{P as default};