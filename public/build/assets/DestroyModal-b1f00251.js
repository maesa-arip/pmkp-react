import{a as e,r as a,j as t}from"./app-39b28b75.js";import{K as s}from"./transition-f985c522.js";import{m as r}from"./dialog-67d91a12.js";function x({title:i,children:n,isOpenDestroyDialog:l,setIsOpenDestroyDialog:o,warning:m="Are you sure ? This action cannot be undone.",size:c="max-w-6xl"}){return e("div",{children:e(s,{appear:!0,show:l,as:a.Fragment,children:t(r,{as:"div",className:"relative z-10",open:l,onClose:()=>{},children:[e(s.Child,{as:a.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e("div",{className:"fixed inset-0 bg-black bg-opacity-25"})}),e("div",{className:"fixed inset-0 overflow-y-auto",children:e("div",{className:"flex items-baseline justify-center min-h-full p-4 text-center",children:e(s.Child,{as:a.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:t(r.Panel,{className:`relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${c}`,children:[e("div",{className:"px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4",children:t("div",{className:"sm:flex sm:items-start",children:[e("div",{className:"flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10",children:t("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-6 h-6 text-red-600 icon icon-tabler icon-tabler-alert-triangle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M12 9v2m0 4v.01"}),e("path",{d:"M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"})]})}),t("div",{className:"mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left",children:[e(r.Title,{as:"h3",className:"text-lg font-medium leading-6 text-gray-900",children:i}),e("div",{className:"mt-2",children:e("p",{className:"text-sm text-gray-500",children:m})})]})]})}),t("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[n,e("button",{type:"button",className:"inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",onClick:()=>o(!1),children:"Cancel"})]})]})})})})]})})})}export{x as D};
