import{r as n,a as e,j as l,F as p}from"./app-ea82073e.js";import{k as r,a as g}from"./ComboboxPage-08579f22.js";import{K as h}from"./transition-b339d8c6.js";function w({ShouldMap:o,selected:c,tampilkanvalue:v="false",onChange:d,name:u}){const[s,f]=n.useState(""),i=s===""?o:o.filter(a=>a.name.toLowerCase().replace(/\s+/g,"").includes(s.toLowerCase().replace(/\s+/g,"")));return e("div",{className:"",children:e(r,{value:c,onChange:d,name:u,children:l("div",{className:"relative mt-1",children:[e("div",{className:"relative w-full overflow-hidden text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300",children:e(r.Input,{className:"w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 break-words border-none focus:ring-0",autoComplete:"off",displayValue:a=>a.name,readOnly:!0})}),e(h,{as:n.Fragment,leave:"transition ease-in duration-100",leaveFrom:"opacity-100",leaveTo:"opacity-0",afterLeave:()=>f(""),children:e(r.Options,{className:"absolute z-10 w-full py-1 mt-1 overflow-auto text-base break-words bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",children:i.length===0&&s!==""?e("div",{className:"relative px-4 py-2 text-gray-700 cursor-default select-none",children:"Nothing found."}):i.map(a=>e(r.Option,{className:({active:t})=>`relative cursor-default select-none py-2 pl-10 pr-4 ${t?"bg-teal-600 text-white":"text-gray-900"}`,value:a,children:({selected:t,active:m})=>l(p,{children:[l("span",{className:`block truncate ${t?"font-medium":"font-normal"}`,children:[a.value," ",a.name]}),t?e("span",{className:`absolute inset-y-0 left-0 flex items-center pl-3 ${m?"text-white":"text-teal-600"}`,children:e(g,{className:"w-5 h-5","aria-hidden":"true"})}):null]})},a.id))})})]})})})}export{w as C};
