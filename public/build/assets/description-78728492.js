import{r as l,e as m}from"./app-0da779d6.js";import{I as d}from"./keyboard-3e1eb91c.js";import{V as f,y as g,c as h,X as x,o as E}from"./transition-d3118cc9.js";let u=l.createContext(null);function c(){let o=l.useContext(u);if(o===null){let t=new Error("You used a <Description /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(t,c),t}return o}function T(){let[o,t]=l.useState([]);return[o.length>0?o.join(" "):void 0,l.useMemo(()=>function(e){let n=E(r=>(t(i=>[...i,r]),()=>t(i=>{let s=i.slice(),p=s.indexOf(r);return p!==-1&&s.splice(p,1),s}))),a=l.useMemo(()=>({register:n,slot:e.slot,name:e.name,props:e.props}),[n,e.slot,e.name,e.props]);return m.createElement(u.Provider,{value:a},e.children)},[t])]}let v="p",w=f(function(o,t){let e=d(),{id:n=`headlessui-description-${e}`,...a}=o,r=c(),i=g(t);h(()=>r.register(n),[n,r.register]);let s={ref:i,...r.props,id:n};return x({ourProps:s,theirProps:a,slot:r.slot||{},defaultTag:v,name:r.name||"Description"})});export{w as F,T as k};
