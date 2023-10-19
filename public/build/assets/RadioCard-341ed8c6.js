import{r as n,R,a as m,j as L,F as ce}from"./app-24588fae.js";import{V as B,y as z,l as ee,X as H,o as k,p as de,P as pe,s as fe,u as me}from"./render-12e546f0.js";import{I as J,h as ve,s as ge,e as he,o as C,a as q,L as j,N as Q,r as Z,A as be}from"./keyboard-049b5e19.js";import{F as Re,k as re}from"./description-cd37925a.js";import{F as ke}from"./use-tree-walker-f54895da.js";import{T as xe,e as Ee,p as $e}from"./use-controllable-d1c2f65c.js";function ye(e=0){let[r,t]=n.useState(e),o=n.useCallback(c=>t(l=>l|c),[r]),s=n.useCallback(c=>!!(r&c),[r]),i=n.useCallback(c=>t(l=>l&~c),[t]),u=n.useCallback(c=>t(l=>l^c),[t]);return{addFlag:o,hasFlag:s,removeFlag:i,toggleFlag:u}}let te=n.createContext(null);function ae(){let e=n.useContext(te);if(e===null){let r=new Error("You used a <Label /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(r,ae),r}return e}function ne(){let[e,r]=n.useState([]);return[e.length>0?e.join(" "):void 0,n.useMemo(()=>function(t){let o=k(i=>(r(u=>[...u,i]),()=>r(u=>{let c=u.slice(),l=c.indexOf(i);return l!==-1&&c.splice(l,1),c}))),s=n.useMemo(()=>({register:o,slot:t.slot,name:t.name,props:t.props}),[o,t.slot,t.name,t.props]);return R.createElement(te.Provider,{value:s},t.children)},[r])]}let we="label",Ce=B(function(e,r){let t=J(),{id:o=`headlessui-label-${t}`,passive:s=!1,...i}=e,u=ae(),c=z(r);ee(()=>u.register(o),[o,u.register]);let l={ref:c,...u.props,id:o};return s&&("onClick"in l&&delete l.onClick,"onClick"in i&&delete i.onClick),H({ourProps:l,theirProps:i,slot:u.slot||{},defaultTag:we,name:u.name||"Label"})});var Fe=(e=>(e[e.RegisterOption=0]="RegisterOption",e[e.UnregisterOption=1]="UnregisterOption",e))(Fe||{});let Ne={0(e,r){let t=[...e.options,{id:r.id,element:r.element,propsRef:r.propsRef}];return{...e,options:be(t,o=>o.element.current)}},1(e,r){let t=e.options.slice(),o=e.options.findIndex(s=>s.id===r.id);return o===-1?e:(t.splice(o,1),{...e,options:t})}},X=n.createContext(null);X.displayName="RadioGroupDataContext";function oe(e){let r=n.useContext(X);if(r===null){let t=new Error(`<${e} /> is missing a parent <RadioGroup /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,oe),t}return r}let Y=n.createContext(null);Y.displayName="RadioGroupActionsContext";function ie(e){let r=n.useContext(Y);if(r===null){let t=new Error(`<${e} /> is missing a parent <RadioGroup /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,ie),t}return r}function Oe(e,r){return me(r.type,Ne,e,r)}let Te="div",Le=B(function(e,r){let t=J(),{id:o=`headlessui-radiogroup-${t}`,value:s,defaultValue:i,name:u,onChange:c,by:l=(a,f)=>a===f,disabled:F=!1,...U}=e,x=k(typeof l=="string"?(a,f)=>{let p=l;return(a==null?void 0:a[p])===(f==null?void 0:f[p])}:l),[N,P]=n.useReducer(Oe,{options:[]}),v=N.options,[W,S]=ne(),[K,E]=re(),$=n.useRef(null),V=z($,r),[h,A]=xe(s,c,i),D=n.useMemo(()=>v.find(a=>!a.propsRef.current.disabled),[v]),b=n.useMemo(()=>v.some(a=>x(a.propsRef.current.value,h)),[v,h]),g=k(a=>{var f;if(F||x(a,h))return!1;let p=(f=v.find(w=>x(w.propsRef.current.value,a)))==null?void 0:f.propsRef.current;return p!=null&&p.disabled?!1:(A==null||A(a),!0)});ke({container:$.current,accept(a){return a.getAttribute("role")==="radio"?NodeFilter.FILTER_REJECT:a.hasAttribute("role")?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT},walk(a){a.setAttribute("role","none")}});let _=k(a=>{let f=$.current;if(!f)return;let p=he(f),w=v.filter(d=>d.propsRef.current.disabled===!1).map(d=>d.element.current);switch(a.key){case C.Enter:$e(a.currentTarget);break;case C.ArrowLeft:case C.ArrowUp:if(a.preventDefault(),a.stopPropagation(),q(w,j.Previous|j.WrapAround)===Q.Success){let d=v.find(O=>O.element.current===(p==null?void 0:p.activeElement));d&&g(d.propsRef.current.value)}break;case C.ArrowRight:case C.ArrowDown:if(a.preventDefault(),a.stopPropagation(),q(w,j.Next|j.WrapAround)===Q.Success){let d=v.find(O=>O.element.current===(p==null?void 0:p.activeElement));d&&g(d.propsRef.current.value)}break;case C.Space:{a.preventDefault(),a.stopPropagation();let d=v.find(O=>O.element.current===(p==null?void 0:p.activeElement));d&&g(d.propsRef.current.value)}break}}),G=k(a=>(P({type:0,...a}),()=>P({type:1,id:a.id}))),y=n.useMemo(()=>({value:h,firstOption:D,containsCheckedOption:b,disabled:F,compare:x,...N}),[h,D,b,F,x,N]),I=n.useMemo(()=>({registerOption:G,change:g}),[G,g]),le={ref:V,id:o,role:"radiogroup","aria-labelledby":W,"aria-describedby":K,onKeyDown:_},se=n.useMemo(()=>({value:h}),[h]),M=n.useRef(null),ue=de();return n.useEffect(()=>{!M.current||i!==void 0&&ue.addEventListener(M.current,"reset",()=>{g(i)})},[M,g]),R.createElement(E,{name:"RadioGroup.Description"},R.createElement(S,{name:"RadioGroup.Label"},R.createElement(Y.Provider,{value:I},R.createElement(X.Provider,{value:y},u!=null&&h!=null&&Ee({[u]:h}).map(([a,f],p)=>R.createElement(ve,{features:ge.Hidden,ref:p===0?w=>{var d;M.current=(d=w==null?void 0:w.closest("form"))!=null?d:null}:void 0,...pe({key:a,as:"input",type:"radio",checked:f!=null,hidden:!0,readOnly:!0,name:a,value:f})})),H({ourProps:le,theirProps:U,slot:se,defaultTag:Te,name:"RadioGroup"})))))});var Pe=(e=>(e[e.Empty=1]="Empty",e[e.Active=2]="Active",e))(Pe||{});let Se="div",Ae=B(function(e,r){var t;let o=J(),{id:s=`headlessui-radiogroup-option-${o}`,value:i,disabled:u=!1,...c}=e,l=n.useRef(null),F=z(l,r),[U,x]=ne(),[N,P]=re(),{addFlag:v,removeFlag:W,hasFlag:S}=ye(1),K=fe({value:i,disabled:u}),E=oe("RadioGroup.Option"),$=ie("RadioGroup.Option");ee(()=>$.registerOption({id:s,element:l,propsRef:K}),[s,$,l,e]);let V=k(y=>{var I;if(Z(y.currentTarget))return y.preventDefault();!$.change(i)||(v(2),(I=l.current)==null||I.focus())}),h=k(y=>{if(Z(y.currentTarget))return y.preventDefault();v(2)}),A=k(()=>W(2)),D=((t=E.firstOption)==null?void 0:t.id)===s,b=E.disabled||u,g=E.compare(E.value,i),_={ref:F,id:s,role:"radio","aria-checked":g?"true":"false","aria-labelledby":U,"aria-describedby":N,"aria-disabled":b?!0:void 0,tabIndex:(()=>b?-1:g||!E.containsCheckedOption&&D?0:-1)(),onClick:b?void 0:V,onFocus:b?void 0:h,onBlur:b?void 0:A},G=n.useMemo(()=>({checked:g,disabled:b,active:S(2)}),[g,b,S]);return R.createElement(P,{name:"RadioGroup.Description"},R.createElement(x,{name:"RadioGroup.Label"},H({ourProps:_,theirProps:c,slot:G,defaultTag:Se,name:"RadioGroup.Option"})))}),T=Object.assign(Le,{Option:Ae,Label:Ce,Description:Re});function Ke({ShouldMap:e,selected:r,onChange:t}){return m("div",{className:"w-full",children:m("div",{className:"w-full max-w-md mx-auto",children:L(T,{value:r,onChange:t,children:[m(T.Label,{className:"sr-only",children:"Server size"}),m("div",{className:"space-y-2",children:e.map(o=>m(T.Option,{onChange:s=>handleChange(s),value:o,className:({active:s,checked:i})=>`${s?"ring-2 ring-white ring-opacity-60 ring-offset-2 ":""}
                  ${i&&o.id==1?"bg-red-500 bg-opacity-75 text-white ring-offset-red-300":"bg-white"}
                  ${i&&o.id!=1?"bg-teal-500 bg-opacity-75 text-white ring-offset-teal-300":"bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`,children:({active:s,checked:i})=>m(ce,{children:L("div",{className:"flex items-center justify-between w-full",children:[m("div",{className:"flex items-center",children:L("div",{className:"text-sm",children:[m(T.Label,{as:"p",className:`font-medium mb-2  ${i?"text-white":"text-gray-900"}`,children:o.name}),L(T.Description,{as:"span",className:`inline ${i?"text-sky-100":"text-gray-500"}`,children:[m("span",{children:o.description})," "]})]})}),i&&m("div",{className:"text-white shrink-0",children:m(De,{className:"w-6 h-6"})})]})})},o.name))})]})})})}function De(e){return L("svg",{viewBox:"0 0 24 24",fill:"none",...e,children:[m("circle",{cx:12,cy:12,r:12,fill:"#fff",opacity:"0.2"}),m("path",{d:"M7 13l3 3 7-7",stroke:"#fff",strokeWidth:1.5,strokeLinecap:"round",strokeLinejoin:"round"})]})}export{Ke as R};
