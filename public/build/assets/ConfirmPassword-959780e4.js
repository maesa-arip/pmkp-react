import{K as p,r as l,j as a,a as s,n as c}from"./app-614c1295.js";import{G as u}from"./GuestLayout-cc65d328.js";import{I as f}from"./InputError-bc96fff5.js";import{I as w}from"./InputLabel-0d6e0d61.js";import{P as h}from"./PrimaryButton-85a5e5df.js";import{T as g}from"./TextInput-178c6511.js";import"./ApplicationLogo-f7dbaafa.js";function j(){const{data:e,setData:t,post:o,processing:m,errors:n,reset:i}=p({password:""});l.useEffect(()=>()=>{i("password")},[]);const d=r=>{t(r.target.name,r.target.value)};return a(u,{children:[s(c,{title:"Confirm Password"}),s("div",{className:"mb-4 text-sm text-gray-600",children:"This is a secure area of the application. Please confirm your password before continuing."}),a("form",{onSubmit:r=>{r.preventDefault(),o(route("password.confirm"))},children:[a("div",{className:"mt-4",children:[s(w,{forInput:"password",value:"Password"}),s(g,{id:"password",type:"password",name:"password",value:e.password,className:"mt-1 block w-full",isFocused:!0,handleChange:d}),s(f,{message:n.password,className:"mt-2"})]}),s("div",{className:"flex items-center justify-end mt-4",children:s(h,{className:"ml-4",processing:m,children:"Confirm"})})]})]})}export{j as default};