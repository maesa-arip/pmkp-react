import{r as o,e as E}from"./app-deaba12f.js";var ye=Object.defineProperty,we=(e,t,n)=>t in e?ye(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,J=(e,t,n)=>(we(e,typeof t!="symbol"?t+"":t,n),n);let Te=class{constructor(){J(this,"current",this.detect()),J(this,"handoffState","pending"),J(this,"currentId",0)}set(t){this.current!==t&&(this.handoffState="pending",this.currentId=0,this.current=t)}reset(){this.set(this.detect())}nextId(){return++this.currentId}get isServer(){return this.current==="server"}get isClient(){return this.current==="client"}detect(){return typeof window>"u"||typeof document>"u"?"server":"client"}handoff(){this.handoffState==="pending"&&(this.handoffState="complete")}get isHandoffComplete(){return this.handoffState==="complete"}},j=new Te,A=(e,t)=>{j.isServer?o.useEffect(e,t):o.useLayoutEffect(e,t)};function O(e){let t=o.useRef(e);return A(()=>{t.current=e},[e]),t}function Se(e){typeof queueMicrotask=="function"?queueMicrotask(e):Promise.resolve().then(e).catch(t=>setTimeout(()=>{throw t}))}function H(){let e=[],t=[],n={enqueue(r){t.push(r)},addEventListener(r,i,f,u){return r.addEventListener(i,f,u),n.add(()=>r.removeEventListener(i,f,u))},requestAnimationFrame(...r){let i=requestAnimationFrame(...r);return n.add(()=>cancelAnimationFrame(i))},nextFrame(...r){return n.requestAnimationFrame(()=>n.requestAnimationFrame(...r))},setTimeout(...r){let i=setTimeout(...r);return n.add(()=>clearTimeout(i))},microTask(...r){let i={current:!0};return Se(()=>{i.current&&r[0]()}),n.add(()=>{i.current=!1})},add(r){return e.push(r),()=>{let i=e.indexOf(r);if(i>=0){let[f]=e.splice(i,1);f()}}},dispose(){for(let r of e.splice(0))r()},async workQueue(){for(let r of t.splice(0))await r()}};return n}function ne(){let[e]=o.useState(H);return o.useEffect(()=>()=>e.dispose(),[e]),e}let $=function(e){let t=O(e);return E.useCallback((...n)=>t.current(...n),[t])};function re(){let[e,t]=o.useState(j.isHandoffComplete);return e&&j.isHandoffComplete===!1&&t(!1),o.useEffect(()=>{e!==!0&&t(!0)},[e]),o.useEffect(()=>j.handoff(),[]),e}function y(e,t,...n){if(e in t){let i=t[e];return typeof i=="function"?i(...n):i}let r=new Error(`Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(t).map(i=>`"${i}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(r,y),r}let ie=Symbol();function Ie(e,t=!0){return Object.assign(e,{[ie]:t})}function oe(...e){let t=o.useRef(e);o.useEffect(()=>{t.current=e},[e]);let n=$(r=>{for(let i of t.current)i!=null&&(typeof i=="function"?i(r):i.current=r)});return e.every(r=>r==null||(r==null?void 0:r[ie]))?void 0:n}function le(...e){return e.filter(Boolean).join(" ")}var se=(e=>(e[e.None=0]="None",e[e.RenderStrategy=1]="RenderStrategy",e[e.Static=2]="Static",e))(se||{}),T=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(T||{});function ue({ourProps:e,theirProps:t,slot:n,defaultTag:r,features:i,visible:f=!0,name:u}){let c=ae(t,e);if(f)return k(c,n,r,u);let s=i??0;if(s&2){let{static:a=!1,...d}=c;if(a)return k(d,n,r,u)}if(s&1){let{unmount:a=!0,...d}=c;return y(a?0:1,{[0](){return null},[1](){return k({...d,hidden:!0,style:{display:"none"}},n,r,u)}})}return k(c,n,r,u)}function k(e,t={},n,r){var i;let{as:f=n,children:u,refName:c="ref",...s}=Q(e,["unmount","static"]),a=e.ref!==void 0?{[c]:e.ref}:{},d=typeof u=="function"?u(t):u;s.className&&typeof s.className=="function"&&(s.className=s.className(t));let g={};if(t){let v=!1,m=[];for(let[l,h]of Object.entries(t))typeof h=="boolean"&&(v=!0),h===!0&&m.push(l);v&&(g["data-headlessui-state"]=m.join(" "))}if(f===o.Fragment&&Object.keys(ee(s)).length>0){if(!o.isValidElement(d)||Array.isArray(d)&&d.length>1)throw new Error(['Passing props on "Fragment"!',"",`The current component <${r} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(s).map(l=>`  - ${l}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map(l=>`  - ${l}`).join(`
`)].join(`
`));let v=le((i=d.props)==null?void 0:i.className,s.className),m=v?{className:v}:{};return o.cloneElement(d,Object.assign({},ae(d.props,ee(Q(s,["ref"]))),g,a,Fe(d.ref,a.ref),m))}return o.createElement(f,Object.assign({},Q(s,["ref"]),f!==o.Fragment&&a,f!==o.Fragment&&g),d)}function Fe(...e){return{ref:e.every(t=>t==null)?void 0:t=>{for(let n of e)n!=null&&(typeof n=="function"?n(t):n.current=t)}}}function ae(...e){if(e.length===0)return{};if(e.length===1)return e[0];let t={},n={};for(let r of e)for(let i in r)i.startsWith("on")&&typeof r[i]=="function"?(n[i]!=null||(n[i]=[]),n[i].push(r[i])):t[i]=r[i];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(n).map(r=>[r,void 0])));for(let r in n)Object.assign(t,{[r](i,...f){let u=n[r];for(let c of u){if((i instanceof Event||(i==null?void 0:i.nativeEvent)instanceof Event)&&i.defaultPrevented)return;c(i,...f)}}});return t}function _(e){var t;return Object.assign(o.forwardRef(e),{displayName:(t=e.displayName)!=null?t:e.name})}function ee(e){let t=Object.assign({},e);for(let n in t)t[n]===void 0&&delete t[n];return t}function Q(e,t=[]){let n=Object.assign({},e);for(let r of t)r in n&&delete n[r];return n}let z=o.createContext(null);z.displayName="OpenClosedContext";var P=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(P||{});function ce(){return o.useContext(z)}function Ce({value:e,children:t}){return E.createElement(z.Provider,{value:e},t)}function fe(){let e=o.useRef(!1);return A(()=>(e.current=!0,()=>{e.current=!1}),[]),e}function $e(e){let t={called:!1};return(...n)=>{if(!t.called)return t.called=!0,e(...n)}}function W(e,...t){e&&t.length>0&&e.classList.add(...t)}function X(e,...t){e&&t.length>0&&e.classList.remove(...t)}function Oe(e,t){let n=H();if(!e)return n.dispose;let{transitionDuration:r,transitionDelay:i}=getComputedStyle(e),[f,u]=[r,i].map(c=>{let[s=0]=c.split(",").filter(Boolean).map(a=>a.includes("ms")?parseFloat(a):parseFloat(a)*1e3).sort((a,d)=>d-a);return s});if(f+u!==0){let c=n.addEventListener(e,"transitionend",s=>{s.target===s.currentTarget&&(t(),c())})}else t();return n.add(()=>t()),n.dispose}function je(e,t,n,r){let i=n?"enter":"leave",f=H(),u=r!==void 0?$e(r):()=>{};i==="enter"&&(e.removeAttribute("hidden"),e.style.display="");let c=y(i,{enter:()=>t.enter,leave:()=>t.leave}),s=y(i,{enter:()=>t.enterTo,leave:()=>t.leaveTo}),a=y(i,{enter:()=>t.enterFrom,leave:()=>t.leaveFrom});return X(e,...t.enter,...t.enterTo,...t.enterFrom,...t.leave,...t.leaveFrom,...t.leaveTo,...t.entered),W(e,...c,...a),f.nextFrame(()=>{X(e,...a),W(e,...s),Oe(e,()=>(X(e,...c),W(e,...t.entered),u()))}),f.dispose}function Pe({container:e,direction:t,classes:n,onStart:r,onStop:i}){let f=fe(),u=ne(),c=O(t);A(()=>{let s=H();u.add(s.dispose);let a=e.current;if(a&&c.current!=="idle"&&f.current)return s.dispose(),r.current(c.current),s.add(je(a,n.current,c.current==="enter",()=>{s.dispose(),i.current(c.current)})),s.dispose},[t])}function C(e=""){return e.split(" ").filter(t=>t.trim().length>1)}let q=o.createContext(null);q.displayName="TransitionContext";var xe=(e=>(e.Visible="visible",e.Hidden="hidden",e))(xe||{});function Re(){let e=o.useContext(q);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}function Ne(){let e=o.useContext(M);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}let M=o.createContext(null);M.displayName="NestingContext";function D(e){return"children"in e?D(e.children):e.current.filter(({el:t})=>t.current!==null).filter(({state:t})=>t==="visible").length>0}function de(e,t){let n=O(e),r=o.useRef([]),i=fe(),f=ne(),u=$((m,l=T.Hidden)=>{let h=r.current.findIndex(({el:p})=>p===m);h!==-1&&(y(l,{[T.Unmount](){r.current.splice(h,1)},[T.Hidden](){r.current[h].state="hidden"}}),f.microTask(()=>{var p;!D(r)&&i.current&&((p=n.current)==null||p.call(n))}))}),c=$(m=>{let l=r.current.find(({el:h})=>h===m);return l?l.state!=="visible"&&(l.state="visible"):r.current.push({el:m,state:"visible"}),()=>u(m,T.Unmount)}),s=o.useRef([]),a=o.useRef(Promise.resolve()),d=o.useRef({enter:[],leave:[],idle:[]}),g=$((m,l,h)=>{s.current.splice(0),t&&(t.chains.current[l]=t.chains.current[l].filter(([p])=>p!==m)),t==null||t.chains.current[l].push([m,new Promise(p=>{s.current.push(p)})]),t==null||t.chains.current[l].push([m,new Promise(p=>{Promise.all(d.current[l].map(([b,w])=>w)).then(()=>p())})]),l==="enter"?a.current=a.current.then(()=>t==null?void 0:t.wait.current).then(()=>h(l)):h(l)}),v=$((m,l,h)=>{Promise.all(d.current[l].splice(0).map(([p,b])=>b)).then(()=>{var p;(p=s.current.shift())==null||p()}).then(()=>h(l))});return o.useMemo(()=>({children:r,register:c,unregister:u,onStart:g,onStop:v,wait:a,chains:d}),[c,u,r,g,v,d,a])}function Le(){}let ke=["beforeEnter","afterEnter","beforeLeave","afterLeave"];function te(e){var t;let n={};for(let r of ke)n[r]=(t=e[r])!=null?t:Le;return n}function Ae(e){let t=o.useRef(te(e));return o.useEffect(()=>{t.current=te(e)},[e]),t}let He="div",me=se.RenderStrategy,pe=_(function(e,t){let{beforeEnter:n,afterEnter:r,beforeLeave:i,afterLeave:f,enter:u,enterFrom:c,enterTo:s,entered:a,leave:d,leaveFrom:g,leaveTo:v,...m}=e,l=o.useRef(null),h=oe(l,t),p=m.unmount?T.Unmount:T.Hidden,{show:b,appear:w,initial:he}=Re(),[S,I]=o.useState(b?"visible":"hidden"),Z=Ne(),{register:x,unregister:R}=Z,U=o.useRef(null);o.useEffect(()=>x(l),[x,l]),o.useEffect(()=>{if(p===T.Hidden&&l.current){if(b&&S!=="visible"){I("visible");return}return y(S,{hidden:()=>R(l),visible:()=>x(l)})}},[S,l,x,R,b,p]);let B=O({enter:C(u),enterFrom:C(c),enterTo:C(s),entered:C(a),leave:C(d),leaveFrom:C(g),leaveTo:C(v)}),N=Ae({beforeEnter:n,afterEnter:r,beforeLeave:i,afterLeave:f}),V=re();o.useEffect(()=>{if(V&&S==="visible"&&l.current===null)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")},[l,S,V]);let K=he&&!w,ve=(()=>!V||K||U.current===b?"idle":b?"enter":"leave")(),be=$(F=>y(F,{enter:()=>N.current.beforeEnter(),leave:()=>N.current.beforeLeave(),idle:()=>{}})),ge=$(F=>y(F,{enter:()=>N.current.afterEnter(),leave:()=>N.current.afterLeave(),idle:()=>{}})),L=de(()=>{I("hidden"),R(l)},Z);Pe({container:l,classes:B,direction:ve,onStart:O(F=>{L.onStart(l,F,be)}),onStop:O(F=>{L.onStop(l,F,ge),F==="leave"&&!D(L)&&(I("hidden"),R(l))})}),o.useEffect(()=>{!K||(p===T.Hidden?U.current=null:U.current=b)},[b,K,S]);let G=m,Ee={ref:h};return w&&b&&j.isServer&&(G={...G,className:le(m.className,...B.current.enter,...B.current.enterFrom)}),E.createElement(M.Provider,{value:L},E.createElement(Ce,{value:y(S,{visible:P.Open,hidden:P.Closed})},ue({ourProps:Ee,theirProps:G,defaultTag:He,features:me,visible:S==="visible",name:"Transition.Child"})))}),Y=_(function(e,t){let{show:n,appear:r=!1,unmount:i,...f}=e,u=o.useRef(null),c=oe(u,t);re();let s=ce();if(n===void 0&&s!==null&&(n=y(s,{[P.Open]:!0,[P.Closed]:!1})),![!0,!1].includes(n))throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");let[a,d]=o.useState(n?"visible":"hidden"),g=de(()=>{d("hidden")}),[v,m]=o.useState(!0),l=o.useRef([n]);A(()=>{v!==!1&&l.current[l.current.length-1]!==n&&(l.current.push(n),m(!1))},[l,n]);let h=o.useMemo(()=>({show:n,appear:r,initial:v}),[n,r,v]);o.useEffect(()=>{if(n)d("visible");else if(!D(g))d("hidden");else{let b=u.current;if(!b)return;let w=b.getBoundingClientRect();w.x===0&&w.y===0&&w.width===0&&w.height===0&&d("hidden")}},[n,g]);let p={unmount:i};return E.createElement(M.Provider,{value:g},E.createElement(q.Provider,{value:h},ue({ourProps:{...p,as:o.Fragment,children:E.createElement(pe,{ref:c,...p,...f})},theirProps:{},defaultTag:o.Fragment,features:me,visible:a==="visible",name:"Transition"})))}),qe=_(function(e,t){let n=o.useContext(q)!==null,r=ce()!==null;return E.createElement(E.Fragment,null,!n&&r?E.createElement(Y,{ref:t,...e}):E.createElement(pe,{ref:t,...e}))}),Ue=Object.assign(Y,{Child:qe,Root:Y});export{Ce as C,Ue as K,ee as P,Ie as T,_ as V,ue as X,A as a,j as b,ce as c,P as d,fe as f,se as j,re as l,H as m,$ as o,ne as p,O as s,Se as t,y as u,oe as y};
