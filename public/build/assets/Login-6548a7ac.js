import{K as g,r as h,j as s,a as e,n as x,f as b}from"./app-43246a29.js";import{C as w}from"./Checkbox-52bf5df7.js";import{G as N}from"./GuestLayout-1c42d6cd.js";import{I as l}from"./InputError-8479d924.js";import{I as n}from"./InputLabel-7159db58.js";import{P as v}from"./PrimaryButton-ab57cc3d.js";import{T as i}from"./TextInput-e2264539.js";import"./ApplicationLogo-c610250b.js";function F({status:m,canResetPassword:c}){const{data:r,setData:d,post:u,processing:p,errors:o,reset:f}=g({email:"",password:"",remember:""});h.useEffect(()=>()=>{f("password")},[]);const t=a=>{d(a.target.name,a.target.type==="checkbox"?a.target.checked:a.target.value)};return s(N,{children:[e(x,{title:"Log in"}),m&&e("div",{className:"mb-4 font-medium text-sm text-green-600",children:m}),s("form",{onSubmit:a=>{a.preventDefault(),u(route("login"))},children:[s("div",{children:[e(n,{forInput:"email",value:"Email"}),e(i,{id:"email",type:"email",name:"email",value:r.email,className:"mt-1 block w-full",autoComplete:"username",isFocused:!0,handleChange:t}),e(l,{message:o.email,className:"mt-2"})]}),s("div",{className:"mt-4",children:[e(n,{forInput:"password",value:"Password"}),e(i,{id:"password",type:"password",name:"password",value:r.password,className:"mt-1 block w-full",autoComplete:"current-password",handleChange:t}),e(l,{message:o.password,className:"mt-2"})]}),e("div",{className:"block mt-4",children:s("label",{className:"flex items-center",children:[e(w,{name:"remember",value:r.remember,handleChange:t}),e("span",{className:"ml-2 text-sm text-gray-600",children:"Remember me"})]})}),s("div",{className:"flex items-center justify-end mt-4",children:[c&&e(b,{href:route("password.request"),className:"underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",children:"Forgot your password?"}),e(v,{className:"ml-4",processing:p,children:"Log in"})]})]})]})}export{F as default};