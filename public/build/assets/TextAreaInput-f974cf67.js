import{r as e,a as s}from"./app-deaba12f.js";const T=e.forwardRef(function({type:o="text",rows:a=3,name:n,id:c,value:f,className:i,autoComplete:u,required:d,readOnly:x,isFocused:m,handleChange:l},r){const t=r||e.useRef();return e.useEffect(()=>{m&&t.current.focus()},[]),s("div",{className:"flex flex-col items-start",children:s("textarea",{type:o,name:n,rows:a,id:c,value:f,className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm "+i,ref:t,autoComplete:u,required:d,readOnly:x,onChange:p=>l(p)})})});export{T};
