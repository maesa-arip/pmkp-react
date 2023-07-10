import{e as h,r as p}from"./app-deaba12f.js";import{l as N,b as v,a as g,u as x,s as L,V as S,X as F}from"./transition-78ca94c2.js";var b;let C=(b=h.useId)!=null?b:function(){let e=N(),[t,n]=h.useState(e?()=>v.nextId():null);return g(()=>{t===null&&n(v.nextId())},[t]),t!=null?""+t:void 0};function P(e){return v.isServer?null:e instanceof Node?e.ownerDocument:e!=null&&e.hasOwnProperty("current")&&e.current instanceof Node?e.current.ownerDocument:document}let w=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var I=(e=>(e[e.First=1]="First",e[e.Previous=2]="Previous",e[e.Next=4]="Next",e[e.Last=8]="Last",e[e.WrapAround=16]="WrapAround",e[e.NoScroll=32]="NoScroll",e))(I||{}),T=(e=>(e[e.Error=0]="Error",e[e.Overflow=1]="Overflow",e[e.Success=2]="Success",e[e.Underflow=3]="Underflow",e))(T||{}),D=(e=>(e[e.Previous=-1]="Previous",e[e.Next=1]="Next",e))(D||{});function y(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(w)).sort((t,n)=>Math.sign((t.tabIndex||Number.MAX_SAFE_INTEGER)-(n.tabIndex||Number.MAX_SAFE_INTEGER)))}var A=(e=>(e[e.Strict=0]="Strict",e[e.Loose=1]="Loose",e))(A||{});function M(e,t=0){var n;return e===((n=P(e))==null?void 0:n.body)?!1:x(t,{[0](){return e.matches(w)},[1](){let o=e;for(;o!==null;){if(o.matches(w))return!0;o=o.parentElement}return!1}})}function X(e){e==null||e.focus({preventScroll:!0})}let O=["textarea","input"].join(",");function H(e){var t,n;return(n=(t=e==null?void 0:e.matches)==null?void 0:t.call(e,O))!=null?n:!1}function R(e,t=n=>n){return e.slice().sort((n,o)=>{let l=t(n),i=t(o);if(l===null||i===null)return 0;let r=l.compareDocumentPosition(i);return r&Node.DOCUMENT_POSITION_FOLLOWING?-1:r&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function j(e,t,{sorted:n=!0,relativeTo:o=null,skipElements:l=[]}={}){let i=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e.ownerDocument,r=Array.isArray(e)?n?R(e):e:y(e);l.length>0&&r.length>1&&(r=r.filter(d=>!l.includes(d))),o=o??i.activeElement;let f=(()=>{if(t&5)return 1;if(t&10)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),m=(()=>{if(t&1)return 0;if(t&2)return Math.max(0,r.indexOf(o))-1;if(t&4)return Math.max(0,r.indexOf(o))+1;if(t&8)return r.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),s=t&32?{preventScroll:!0}:{},a=0,u=r.length,c;do{if(a>=u||a+u<=0)return 0;let d=m+a;if(t&16)d=(d+u)%u;else{if(d<0)return 3;if(d>=u)return 1}c=r[d],c==null||c.focus(s),a+=f}while(c!==i.activeElement);return t&6&&H(c)&&c.select(),c.hasAttribute("tabindex")||c.setAttribute("tabindex","0"),2}function E(e,t,n){let o=L(t);p.useEffect(()=>{function l(i){o.current(i)}return document.addEventListener(e,l,n),()=>document.removeEventListener(e,l,n)},[e,n])}function q(e,t,n=!0){let o=p.useRef(!1);p.useEffect(()=>{requestAnimationFrame(()=>{o.current=n})},[n]);function l(r,f){if(!o.current||r.defaultPrevented)return;let m=function a(u){return typeof u=="function"?a(u()):Array.isArray(u)||u instanceof Set?u:[u]}(e),s=f(r);if(s!==null&&s.getRootNode().contains(s)){for(let a of m){if(a===null)continue;let u=a instanceof HTMLElement?a:a.current;if(u!=null&&u.contains(s)||r.composed&&r.composedPath().includes(u))return}return!M(s,A.Loose)&&s.tabIndex!==-1&&r.preventDefault(),t(r,s)}}let i=p.useRef(null);E("mousedown",r=>{var f,m;o.current&&(i.current=((m=(f=r.composedPath)==null?void 0:f.call(r))==null?void 0:m[0])||r.target)},!0),E("click",r=>{!i.current||(l(r,()=>i.current),i.current=null)},!0),E("blur",r=>l(r,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0)}function B(e){let t=e.parentElement,n=null;for(;t&&!(t instanceof HTMLFieldSetElement);)t instanceof HTMLLegendElement&&(n=t),t=t.parentElement;let o=(t==null?void 0:t.getAttribute("disabled"))==="";return o&&U(n)?!1:o}function U(e){if(!e)return!1;let t=e.previousElementSibling;for(;t!==null;){if(t instanceof HTMLLegendElement)return!1;t=t.previousElementSibling}return!0}let _="div";var $=(e=>(e[e.None=1]="None",e[e.Focusable=2]="Focusable",e[e.Hidden=4]="Hidden",e))($||{});let V=S(function(e,t){let{features:n=1,...o}=e,l={ref:t,"aria-hidden":(n&2)===2?!0:void 0,style:{position:"fixed",top:1,left:1,width:1,height:0,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0",...(n&4)===4&&(n&2)!==2&&{display:"none"}}};return F({ourProps:l,theirProps:o,slot:{},defaultTag:_,name:"Hidden"})});var k=(e=>(e.Space=" ",e.Enter="Enter",e.Escape="Escape",e.Backspace="Backspace",e.Delete="Delete",e.ArrowLeft="ArrowLeft",e.ArrowUp="ArrowUp",e.ArrowRight="ArrowRight",e.ArrowDown="ArrowDown",e.Home="Home",e.End="End",e.PageUp="PageUp",e.PageDown="PageDown",e.Tab="Tab",e))(k||{});export{R as A,A as F,j as I,I as L,T as N,X as S,C as a,q as b,M as c,P as e,V as h,k as o,B as r,$ as s};
