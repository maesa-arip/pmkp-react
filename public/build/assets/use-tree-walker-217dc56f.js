import{r as c}from"./app-e63dc518.js";import{l as d}from"./render-d70bc49e.js";import{e as m}from"./keyboard-447131b1.js";function b({container:e,accept:r,walk:t,enabled:f=!0}){let o=c.useRef(r),n=c.useRef(t);c.useEffect(()=>{o.current=r,n.current=t},[r,t]),d(()=>{if(!e||!f)return;let u=m(e);if(!u)return;let a=o.current,l=n.current,p=Object.assign(s=>a(s),{acceptNode:a}),i=u.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,p,!1);for(;i.nextNode();)l(i.currentNode)},[e,f,o,n])}export{b as F};