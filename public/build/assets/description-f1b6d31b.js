import{r as a,R as m}from"./app-43246a29.js";import{I as d}from"./keyboard-316c5b02.js";import{V as f,y as g,l as h,X as x,o as E}from"./render-b2513a84.js";let u=a.createContext(null);function c(){let o=a.useContext(u);if(o===null){let t=new Error("You used a <Description /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(t,c),t}return o}function T(){let[o,t]=a.useState([]);return[o.length>0?o.join(" "):void 0,a.useMemo(()=>function(e){let n=E(r=>(t(i=>[...i,r]),()=>t(i=>{let s=i.slice(),p=s.indexOf(r);return p!==-1&&s.splice(p,1),s}))),l=a.useMemo(()=>({register:n,slot:e.slot,name:e.name,props:e.props}),[n,e.slot,e.name,e.props]);return m.createElement(u.Provider,{value:l},e.children)},[t])]}let v="p",w=f(function(o,t){let e=d(),{id:n=`headlessui-description-${e}`,...l}=o,r=c(),i=g(t);h(()=>r.register(n),[n,r.register]);let s={ref:i,...r.props,id:n};return x({ourProps:s,theirProps:l,slot:r.slot||{},defaultTag:v,name:r.name||"Description"})});export{w as F,T as k};