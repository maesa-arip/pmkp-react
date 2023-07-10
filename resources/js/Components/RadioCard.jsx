import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'



export default function RadioCard({ShouldMap, selected, onChange}) {
  // const [selected, setSelected] = useState(plans[0])

  return (
    <div className="w-full">
      <div className="w-full max-w-md mx-auto">
        <RadioGroup value={selected} onChange={onChange}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
          {ShouldMap.map((item) => (
            
              <RadioGroup.Option
                key={item.name}
                onChange={(e) => handleChange(e)}
                value={item}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 '
                      : ''
                  }
                  ${
                    checked && item.id == 1  ? 'bg-red-500 bg-opacity-75 text-white ring-offset-red-300'  : 'bg-white'
                  }
                  ${
                    checked && item.id != 1  ? 'bg-teal-500 bg-opacity-75 text-white ring-offset-teal-300' : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium mb-2  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {item.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-sky-100' : 'text-gray-500'
                            }`}
                          >
                            <span>
                              {item.description} 
                            </span>{' '}
                            {/* <span aria-hidden="true">&middot;</span>{' '}
                            <span>{item.name}</span> */}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      
                      {checked && (
                        <div className="text-white shrink-0">
                          <CheckIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
