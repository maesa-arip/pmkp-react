import{a as e,F as a,f as s}from"./app-40227382.js";const l=({children:r,overflow:t="overflow-x-auto"})=>e(a,{children:e("div",{className:"flex flex-col "+t,children:e("div",{className:"rounded-lg",children:e("div",{className:"inline-block min-w-full py-2 align-middle",children:e("div",{className:"min-w-full border rounded-lg border-slate-300",children:e("table",{className:"min-w-full border-separate rounded-lg",children:r})})})})})}),d=({children:r})=>e(a,{children:e("thead",{className:"bg-gray-50",children:r})}),o=({children:r,onClick:t,className:n="text-left",width:i})=>e(a,{children:e("th",{scope:"col",className:"px-6 py-3 text-xs font-semibold tracking-normal text-gray-800 uppercase border rounded-lg border-slate-300 "+n,children:e("div",{className:"flex items-center cursor-pointer gap-x-1 "+i,onClick:t,children:r})})}),c=({children:r})=>e(a,{children:e("tbody",{className:"bg-white divide-y divide-gray-200",children:r})}),g=({children:r,className:t=""})=>e(a,{children:e("td",{className:"px-6 py-4 text-sm font-normal tracking-normal border border-slate-300 rounded-lg "+t,children:r})}),u=({children:r})=>e("tr",{children:r});l.Thead=d;l.Th=o;l.Tbody=c;l.Td=g;l.Tr=u;const m=l;function x({meta:r}){return e("ul",{className:"flex items-center mt-2 gap-x-1",children:r.links.map((t,n)=>e(s,{as:"button",disabled:t.url==null,href:t.url,className:`${t.url==null?"text-gray-500":""} ${t.active==!0?"bg-blue-50 text-blue-600 ring-blue-500/10 inline-flex items-center rounded font-medium ring-1 ring-inset":"bg-white border"} w-12 h-9 rounded flex items-center justify-center`,children:t.label},n))})}function y({className:r="",children:t,color:n="blue"}){return e("span",{className:`${{blue:"bg-blue-50 text-blue-600 ring-blue-500/10",red:"bg-red-50 text-red-600 ring-red-500/10",yellow:"bg-yellow-50 text-yellow-600 ring-yellow-500/10",amber:"bg-amber-50 text-amber-600 ring-amber-500/10",teal:"bg-teal-50 text-teal-600 ring-teal-500/10",emerald:"bg-emerald-50 text-emerald-600 ring-emerald-500/10",cyan:"bg-cyan-50 text-cyan-600 ring-cyan-500/10",sky:"bg-sky-50 text-sky-600 ring-sky-500/10",gray:"bg-gray-50 text-gray-600 ring-gray-500/10",green:"bg-green-50 text-green-600 ring-green-500/10",violet:"bg-violet-50 text-violet-600 ring-violet-500/10",fuchsia:"bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-500/10"}[n]} inline-flex items-center rounded-md px-2 py-1 mr-1 text-xs font-medium ring-1 ring-inset `+r,children:t})}export{y as B,x as P,m as T};
