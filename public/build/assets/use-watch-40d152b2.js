import{r as o}from"./app-76e0e351.js";import{o as l}from"./transition-289cd6ec.js";function p(f,r){let e=o.useRef([]),t=l(f);o.useEffect(()=>{let n=[...e.current];for(let[u,c]of r.entries())if(e.current[u]!==c){let i=t(r,n);return e.current=r,i}},[t,...r])}export{p as m};