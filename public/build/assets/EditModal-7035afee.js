import{a as e,r as a,j as r}from"./app-deaba12f.js";import{K as t}from"./transition-78ca94c2.js";import{m as i}from"./dialog-fda035d5.js";function h({title:s,children:o,isOpenEditDialog:l,setIsOpenEditDialog:c,size:n="max-w-4xl"}){return e("div",{children:e(t,{appear:!0,show:l,as:a.Fragment,children:r(i,{as:"div",className:"relative z-10",open:l,onClose:()=>{},children:[e(t.Child,{as:a.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e("div",{className:"fixed inset-0 bg-black bg-opacity-25"})}),e("div",{className:"fixed inset-0 overflow-y-auto",children:e("div",{className:"flex items-baseline justify-center min-h-full p-4 text-center",children:e(t.Child,{as:a.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:r(i.Panel,{className:`w-full transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ${n}`,children:[e(i.Title,{as:"h3",className:"text-lg font-medium leading-6 text-gray-900",children:s}),e("div",{className:"mt-2",children:o})]})})})})]})})})}export{h as E};
