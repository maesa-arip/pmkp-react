import { useState, Fragment } from 'react'
import { Switch } from '@headlessui/react'

export default function MyToggle({name,value,defaultChecked, onChange, enabled,setEnabled}) {

  return (
    <Switch checked={enabled} setEnabled={setEnabled} name={name} value={value} onChange={onChange} as={Fragment} defaultChecked={defaultChecked}>
      {({ checked }) => (
        
        /* Use the `checked` state to conditionally style the button. */
        <button 
          className={`${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          {/* <span className="sr-only">Enable notifications</span> */}
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </button>
      )}
    </Switch>
  )
}