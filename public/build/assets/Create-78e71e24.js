import{K as c,a as e}from"./app-deaba12f.js";import f from"./Form-8e9c4b7b.js";import"./InputError-69d219ea.js";import"./InputLabel-c23c89f4.js";import"./PrimaryButton-4345420b.js";import"./SecondaryButton-0599126b.js";import"./TextInput-4dda37a4.js";import"./TextInputCheckbox-60c7f32b.js";function C({setIsOpenAddDialog:t,roles:s,enabled:m,setEnabled:a}){const{data:o,setData:i,post:n,reset:p,errors:u}=c({name:"",email:"",password:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("users.store"),{data:o,onSuccess:()=>{p(),t(!1)}})},children:e(f,{errors:u,data:o,roles:s,enabled:m,setEnabled:a,setData:i,submit:"Simpan",closeButton:r=>t(!1)})})}export{C as default};
