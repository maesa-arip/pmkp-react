import{a as t,r as m,j as d,F as H,f,_ as S}from"./app-deaba12f.js";import{A as U}from"./ApplicationLogo-8cf3a095.js";import{K as J}from"./transition-78ca94c2.js";function Y({children:e}){return t("div",{className:"mx-auto bg-white sm:px-6 lg:px-8",children:e})}const A=m.createContext(),O=({children:e})=>{const[r,i]=m.useState(!1),a=()=>{i(s=>!s)};return t(A.Provider,{value:{open:r,setOpen:i,toggleOpen:a},children:t("div",{className:"relative",children:e})})},Z=({children:e})=>{const{open:r,setOpen:i,toggleOpen:a}=m.useContext(A);return d(H,{children:[t("div",{onClick:a,children:e}),r&&t("div",{className:"fixed inset-0 z-40",onClick:()=>i(!1)})]})},q=({align:e="right",width:r="48",contentClasses:i="py-1 bg-white",children:a})=>{const{open:s,setOpen:n}=m.useContext(A);let l="origin-top";e==="left"?l="origin-top-left left-0":e==="right"&&(l="origin-top-right right-0");let o="";return r==="48"&&(o="w-48"),t(H,{children:t(J,{as:m.Fragment,show:s,enter:"transition ease-out duration-200",enterFrom:"transform opacity-0 scale-95",enterTo:"transform opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"transform opacity-100 scale-100",leaveTo:"transform opacity-0 scale-95",children:t("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${l} ${o}`,onClick:()=>n(!1),children:t("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+i,children:a})})})})},G=({href:e,method:r,as:i,children:a})=>t(f,{href:e,method:r,as:i,className:"block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100",children:a});O.Trigger=Z;O.Content=q;O.Link=G;const u=O;let Q={data:""},X=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||Q,ee=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,te=/\/\*[^]*?\*\/|  +/g,F=/\n+/g,N=(e,r)=>{let i="",a="",s="";for(let n in e){let l=e[n];n[0]=="@"?n[1]=="i"?i=n+" "+l+";":a+=n[1]=="f"?N(l,n):n+"{"+N(l,n[1]=="k"?"":r)+"}":typeof l=="object"?a+=N(l,r?r.replace(/([^,])+/g,o=>n.replace(/(^:.*)|([^,])+/g,c=>/&/.test(c)?c.replace(/&/g,o):o?o+" "+c:c)):n):l!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=N.p?N.p(n,l):n+":"+l+";")}return i+(r&&s?r+"{"+s+"}":s)+a},y={},W=e=>{if(typeof e=="object"){let r="";for(let i in e)r+=i+W(e[i]);return r}return e},re=(e,r,i,a,s)=>{let n=W(e),l=y[n]||(y[n]=(c=>{let h=0,p=11;for(;h<c.length;)p=101*p+c.charCodeAt(h++)>>>0;return"go"+p})(n));if(!y[l]){let c=n!==e?e:(h=>{let p,v,x=[{}];for(;p=ee.exec(h.replace(te,""));)p[4]?x.shift():p[3]?(v=p[3].replace(F," ").trim(),x.unshift(x[0][v]=x[0][v]||{})):x[0][p[1]]=p[2].replace(F," ").trim();return x[0]})(e);y[l]=N(s?{["@keyframes "+l]:c}:c,i?"":"."+l)}let o=i&&y.g?y.g:null;return i&&(y.g=y[l]),((c,h,p,v)=>{v?h.data=h.data.replace(v,c):h.data.indexOf(c)===-1&&(h.data=p?c+h.data:h.data+c)})(y[l],r,a,o),l},ie=(e,r,i)=>e.reduce((a,s,n)=>{let l=r[n];if(l&&l.call){let o=l(i),c=o&&o.props&&o.props.className||/^go/.test(o)&&o;l=c?"."+c:o&&typeof o=="object"?o.props?"":N(o,""):o===!1?"":o}return a+s+(l??"")},"");function D(e){let r=this||{},i=e.call?e(r.p):e;return re(i.unshift?i.raw?ie(i,[].slice.call(arguments,1),r.p):i.reduce((a,s)=>Object.assign(a,s&&s.call?s(r.p):s),{}):i,X(r.target),r.g,r.o,r.k)}let V,B,T;D.bind({g:1});let w=D.bind({k:1});function ne(e,r,i,a){N.p=r,V=e,B=i,T=a}function k(e,r){let i=this||{};return function(){let a=arguments;function s(n,l){let o=Object.assign({},n),c=o.className||s.className;i.p=Object.assign({theme:B&&B()},o),i.o=/ *go\d+/.test(c),o.className=D.apply(i,a)+(c?" "+c:""),r&&(o.ref=l);let h=e;return e[0]&&(h=o.as||e,delete o.as),T&&h[0]&&T(o),V(h,o)}return r?r(s):s}}var ae=e=>typeof e=="function",E=(e,r)=>ae(e)?e(r):e,se=(()=>{let e=0;return()=>(++e).toString()})(),_=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let r=matchMedia("(prefers-reduced-motion: reduce)");e=!r||r.matches}return e}})(),oe=20,j=new Map,le=1e3,K=e=>{if(j.has(e))return;let r=setTimeout(()=>{j.delete(e),L({type:4,toastId:e})},le);j.set(e,r)},de=e=>{let r=j.get(e);r&&clearTimeout(r)},I=(e,r)=>{switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,oe)};case 1:return r.toast.id&&de(r.toast.id),{...e,toasts:e.toasts.map(n=>n.id===r.toast.id?{...n,...r.toast}:n)};case 2:let{toast:i}=r;return e.toasts.find(n=>n.id===i.id)?I(e,{type:1,toast:i}):I(e,{type:0,toast:i});case 3:let{toastId:a}=r;return a?K(a):e.toasts.forEach(n=>{K(n.id)}),{...e,toasts:e.toasts.map(n=>n.id===a||a===void 0?{...n,visible:!1}:n)};case 4:return r.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(n=>n.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let s=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(n=>({...n,pauseDuration:n.pauseDuration+s}))}}},R=[],$={toasts:[],pausedAt:void 0},L=e=>{$=I($,e),R.forEach(r=>{r($)})},ce={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},me=(e={})=>{let[r,i]=m.useState($);m.useEffect(()=>(R.push(i),()=>{let s=R.indexOf(i);s>-1&&R.splice(s,1)}),[r]);let a=r.toasts.map(s=>{var n,l;return{...e,...e[s.type],...s,duration:s.duration||((n=e[s.type])==null?void 0:n.duration)||(e==null?void 0:e.duration)||ce[s.type],style:{...e.style,...(l=e[s.type])==null?void 0:l.style,...s.style}}});return{...r,toasts:a}},he=(e,r="blank",i)=>({createdAt:Date.now(),visible:!0,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...i,id:(i==null?void 0:i.id)||se()}),C=e=>(r,i)=>{let a=he(r,e,i);return L({type:2,toast:a}),a.id},g=(e,r)=>C("blank")(e,r);g.error=C("error");g.success=C("success");g.loading=C("loading");g.custom=C("custom");g.dismiss=e=>{L({type:3,toastId:e})};g.remove=e=>L({type:4,toastId:e});g.promise=(e,r,i)=>{let a=g.loading(r.loading,{...i,...i==null?void 0:i.loading});return e.then(s=>(g.success(E(r.success,s),{id:a,...i,...i==null?void 0:i.success}),s)).catch(s=>{g.error(E(r.error,s),{id:a,...i,...i==null?void 0:i.error})}),e};var ue=(e,r)=>{L({type:1,toast:{id:e,height:r}})},pe=()=>{L({type:5,time:Date.now()})},fe=e=>{let{toasts:r,pausedAt:i}=me(e);m.useEffect(()=>{if(i)return;let n=Date.now(),l=r.map(o=>{if(o.duration===1/0)return;let c=(o.duration||0)+o.pauseDuration-(n-o.createdAt);if(c<0){o.visible&&g.dismiss(o.id);return}return setTimeout(()=>g.dismiss(o.id),c)});return()=>{l.forEach(o=>o&&clearTimeout(o))}},[r,i]);let a=m.useCallback(()=>{i&&L({type:6,time:Date.now()})},[i]),s=m.useCallback((n,l)=>{let{reverseOrder:o=!1,gutter:c=8,defaultPosition:h}=l||{},p=r.filter(b=>(b.position||h)===(n.position||h)&&b.height),v=p.findIndex(b=>b.id===n.id),x=p.filter((b,P)=>P<v&&b.visible).length;return p.filter(b=>b.visible).slice(...o?[x+1]:[0,x]).reduce((b,P)=>b+(P.height||0)+c,0)},[r]);return{toasts:r,handlers:{updateHeight:ue,startPause:pe,endPause:a,calculateOffset:s}}},ge=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,xe=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ve=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,be=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ge} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${xe} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ve} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ye=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,we=k("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${ye} 1s linear infinite;
`,Ne=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ke=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Le=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ne} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ke} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Ce=k("div")`
  position: absolute;
`,Me=k("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,je=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Re=k("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${je} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,$e=({toast:e})=>{let{icon:r,type:i,iconTheme:a}=e;return r!==void 0?typeof r=="string"?m.createElement(Re,null,r):r:i==="blank"?null:m.createElement(Me,null,m.createElement(we,{...a}),i!=="loading"&&m.createElement(Ce,null,i==="error"?m.createElement(be,{...a}):m.createElement(Le,{...a})))},Ee=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Oe=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,De="0%{opacity:0;} 100%{opacity:1;}",Pe="0%{opacity:1;} 100%{opacity:0;}",ze=k("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Be=k("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Te=(e,r)=>{let i=e.includes("top")?1:-1,[a,s]=_()?[De,Pe]:[Ee(i),Oe(i)];return{animation:r?`${w(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Ie=m.memo(({toast:e,position:r,style:i,children:a})=>{let s=e.height?Te(e.position||r||"top-center",e.visible):{opacity:0},n=m.createElement($e,{toast:e}),l=m.createElement(Be,{...e.ariaProps},E(e.message,e));return m.createElement(ze,{className:e.className,style:{...s,...i,...e.style}},typeof a=="function"?a({icon:n,message:l}):m.createElement(m.Fragment,null,n,l))});ne(m.createElement);var Se=({id:e,className:r,style:i,onHeightUpdate:a,children:s})=>{let n=m.useCallback(l=>{if(l){let o=()=>{let c=l.getBoundingClientRect().height;a(e,c)};o(),new MutationObserver(o).observe(l,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return m.createElement("div",{ref:n,className:r,style:i},s)},Ae=(e,r)=>{let i=e.includes("top"),a=i?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:_()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(i?1:-1)}px)`,...a,...s}},Fe=D`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,M=16,Ke=({reverseOrder:e,position:r="top-center",toastOptions:i,gutter:a,children:s,containerStyle:n,containerClassName:l})=>{let{toasts:o,handlers:c}=fe(i);return m.createElement("div",{style:{position:"fixed",zIndex:9999,top:M,left:M,right:M,bottom:M,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},o.map(h=>{let p=h.position||r,v=c.calculateOffset(h,{reverseOrder:e,gutter:a,defaultPosition:r}),x=Ae(p,v);return m.createElement(Se,{id:h.id,key:h.id,onHeightUpdate:c.updateHeight,className:h.visible?Fe:"",style:x},h.type==="custom"?E(h.message,h):s?s(h):m.createElement(Ie,{toast:h,position:p}))}))},He=g;function We({href:e,active:r,children:i}){return t(f,{href:e,className:r?"inline-flex items-center px-1 pt-1 border-b-2 border-indigo-400 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out":"inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out",children:i})}function z({method:e="get",as:r="a",href:i,active:a=!1,children:s}){return t(f,{method:e,as:r,href:i,className:`w-full flex items-start pl-3 pr-4 py-2 border-l-4 ${a?"border-indigo-400 text-indigo-700 bg-indigo-50 focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700":"border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300"} text-base font-medium focus:outline-none transition duration-150 ease-in-out`,children:s})}function Ve(){const{auth:e,permissionNames:r}=S().props;m.useState(!1);const[i,a]=m.useState(!1),s=r?r.map(n=>n.name):"null";return d("nav",{className:"my-4 bg-white border rounded-xl",children:[t("div",{className:"px-4 mx-auto bg-white",children:d("div",{className:"flex justify-between h-16",children:[d("div",{className:"flex",children:[t("div",{className:"flex items-center shrink-0",children:t(f,{href:"/",children:t(U,{className:"block w-auto text-gray-800 fill-current h-9"})})}),d("div",{className:"hidden space-x-8 sm:-my-px sm:ml-10 sm:flex",children:[t(We,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),s.indexOf("atur hak akses")>-1&&t("div",{className:"hidden sm:flex sm:items-center sm:ml-6",children:t("div",{className:"relative ml-3",children:d(u,{children:[t(u.Trigger,{children:t("span",{className:"inline-flex rounded-md",children:d("button",{type:"button",className:"inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none",children:["Permission",t("svg",{className:"ml-2 -mr-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:t("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),d(u.Content,{children:[t(f,{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",href:route("users.index"),children:"Users"}),t(f,{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",href:route("roles.index"),children:"Roles"}),t(f,{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",href:route("permissions.index"),children:"Permissions"})]})]})})}),s.indexOf("edit data master manajemen risiko")>-1&&t("div",{className:"hidden sm:flex sm:items-center sm:ml-6",children:t("div",{className:"relative ml-3",children:d(u,{children:[t(u.Trigger,{children:t("span",{className:"inline-flex rounded-md",children:d("button",{type:"button",className:"inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none",children:["Master Resiko",t("svg",{className:"ml-2 -mr-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:t("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),d(u.Content,{children:[t(u.Link,{href:route("riskCategories.index"),children:"Kategori Risiko"}),t(u.Link,{href:route("identificationSources.index"),children:"Sumber Identifikasi"}),t(u.Link,{href:route("locations.index"),children:"Lokasi"}),t(u.Link,{href:route("riskVarieties.index"),children:"Jenis Insiden"}),t(u.Link,{href:route("riskTypes.index"),children:"Tipe Insiden"}),t(u.Link,{href:route("pics.index"),children:"Penangung Jawab/PIC"})]})]})})}),s.indexOf("atur data nilai")>-1&&t("div",{className:"hidden sm:flex sm:items-center sm:ml-6",children:t("div",{className:"relative ml-3",children:d(u,{children:[t(u.Trigger,{children:t("span",{className:"inline-flex rounded-md",children:d("button",{type:"button",className:"inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none",children:["Data Nilai",t("svg",{className:"ml-2 -mr-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:t("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),d(u.Content,{children:[t(u.Link,{href:route("impactValues.index"),children:"Dampak"}),t(u.Link,{href:route("probabilityValues.index"),children:"Probabilitas"}),t(u.Link,{href:route("controlValues.index"),children:"Controllability"})]})]})})}),s.indexOf("lihat data risk register sesuai lokasi")>-1&&t("div",{className:"hidden sm:flex sm:items-center sm:ml-6",children:t("div",{className:"relative ml-3",children:d(u,{children:[t(u.Trigger,{children:t("span",{className:"inline-flex rounded-md",children:d("button",{type:"button",className:"inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none",children:["Data Risiko",t("svg",{className:"ml-2 -mr-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:t("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),d(u.Content,{children:[t(u.Link,{href:route("riskRegisterKlinis.index"),children:"Risk Register Klinis"}),t(u.Link,{href:route("riskRegisterNonKlinis.index"),children:"Risk Register Non Klinis"})]})]})})})]})]}),t("div",{className:"hidden sm:flex sm:items-center sm:ml-6",children:t("div",{className:"relative ml-3",children:d(u,{children:[t(u.Trigger,{children:t("span",{className:"inline-flex rounded-md",children:d("button",{type:"button",className:"inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none",children:[e.user.name,t("svg",{className:"ml-2 -mr-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:t("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),d(u.Content,{children:[t(u.Link,{href:route("profile.edit"),children:"Profile"}),t(u.Link,{href:route("logout"),method:"post",as:"button",children:"Log Out"})]})]})})}),t("div",{className:"flex items-center -mr-2 sm:hidden",children:t("button",{onClick:()=>a(n=>!n),className:"inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500",children:d("svg",{className:"w-6 h-6",stroke:"currentColor",fill:"none",viewBox:"0 0 24 24",children:[t("path",{className:i?"hidden":"inline-flex",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"}),t("path",{className:i?"inline-flex":"hidden",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})]})})})]})}),d("div",{className:(i?"block":"hidden")+" sm:hidden",children:[t("div",{className:"pt-2 pb-3 space-y-1",children:t(z,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"})}),d("div",{className:"pt-4 pb-1 border-t border-gray-200",children:[d("div",{className:"px-4",children:[t("div",{className:"text-base font-medium text-gray-800",children:e.user.name}),t("div",{className:"text-sm font-medium text-gray-500",children:e.user.email})]}),d("div",{className:"mt-3 space-y-1",children:[t(z,{href:route("profile.edit"),children:"Profile"}),t(z,{method:"post",href:route("logout"),as:"button",children:"Log Out"})]})]})]})]})}function _e(){const{auth:e,notifications:r}=S().props;return t("div",{className:"hidden min-h-screen col-span-2 col-start-1 p-4 antialiased text-gray-800 md:block",children:t("div",{className:"top-0 left-0 flex flex-col w-full h-full bg-white border rounded-xl ",children:t("div",{className:"flex-grow overflow-x-hidden overflow-y-auto",children:d("ul",{className:"flex flex-col py-4 space-y-1",children:[t("li",{className:"px-5",children:t("div",{className:"flex flex-row items-center h-8",children:t("div",{className:"text-sm font-light tracking-wide text-gray-500",children:"Menu"})})}),t("li",{children:d("span",{href:"#",className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"})})}),t(f,{href:route("dashboard"),className:"ml-2 text-sm tracking-wide truncate",children:"Dashboard"})]})}),t("li",{children:d(f,{href:route("dashboard"),className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"})})}),t("span",{className:"ml-2 text-sm tracking-wide truncate",children:"Notifications"}),r?t("span",{className:"px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full",children:r}):t("span",{className:"px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full",children:"0"})]})}),t("li",{className:"px-5",children:t("div",{className:"flex flex-row items-center h-8",children:t("div",{className:"text-sm font-light tracking-wide text-gray-500",children:"Report"})})}),t("li",{children:d("a",{href:route("export.riskregisterklinislarsdhp"),className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"})})}),t("span",{className:"ml-2 text-sm tracking-wide truncate",children:"Format LARS DHP"})]})}),t("li",{children:d("a",{href:route("export.riskregisterklinisfitur4"),className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"})})}),t("span",{className:"ml-2 text-sm tracking-wide truncate",children:"Format Fitur 4"})]})}),t("li",{children:d("a",{href:route("export.riskregisterklinisbpkp"),className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"})})}),t("span",{className:"ml-2 text-sm tracking-wide truncate",children:"Format BPKP KLINIS"})]})}),t("li",{children:d("a",{href:route("export.riskregisternonklinisbpkp"),className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"})})}),t("span",{className:"ml-2 text-sm tracking-tighter truncate",children:"Format BPKP NON KLINIS"})]})}),t("li",{className:"px-5",children:t("div",{className:"flex flex-row items-center h-8",children:t("div",{className:"text-sm font-light tracking-wide text-gray-500",children:"Data Risiko"})})}),t("li",{children:d("span",{href:"#",className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"})})}),t(f,{href:route("riskRegisterKlinis.index"),className:"ml-2 text-sm tracking-wide truncate",children:"Risk Register Klinis"})]})}),t("li",{children:d("span",{href:"#",className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"})})}),t(f,{href:route("riskRegisterNonKlinis.index"),className:"ml-2 text-sm tracking-wide truncate",children:"Risk Register Non Klinis"})]})}),t("li",{className:"px-5",children:t("div",{className:"flex flex-row items-center h-8",children:t("div",{className:"text-sm font-light tracking-wide text-gray-500",children:"Settings"})})}),t("li",{children:d("span",{href:"#",className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"})})}),t(f,{href:route("profile.edit"),className:"ml-2 text-sm tracking-wide truncate",children:"Profile"})]})}),t("li",{children:d("span",{href:"#",className:"relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-indigo-500",children:[t("span",{className:"inline-flex items-center justify-center ml-4",children:t("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:t("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"})})}),t(f,{href:route("logout"),method:"post",as:"button",className:"ml-2 text-sm tracking-wide truncate",children:"Logout"})]})})]})})})})}function Ze({auth:e,header:r,children:i}){m.useState(!1);const{flash:a}=S().props;return m.useEffect(()=>{a.type&&He[a.type](a.message)}),d("div",{className:"min-h-screen",children:[t(Ke,{position:"top-center",reverseOrder:!1}),t(Y,{children:d("div",{className:"grid grid-cols-12",children:[t(_e,{}),d("div",{className:"min-h-screen col-span-12 col-start-1 bg-white md:col-span-10 md:col-start-3",children:[t(Ve,{}),t("main",{children:i})]})]})})]})}export{Ze as A,u as D};
