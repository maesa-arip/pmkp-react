import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInputWithError(
    {
        type = "text",
        name,
        id,
        value,
        readOnly,
        className,
        autoComplete,
        required,
        isFocused,
        handleChange,
        forInput,
        label,
        children,
        message,
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <>
            <label
                htmlFor={forInput}
                className={`block font-medium text-sm text-gray-700 ${className}`}
            >
                {label ? label : children}
            </label>
            <div className="flex flex-col items-start">
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={value}
                    className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full mt-1 ${className}`}
                    ref={input}
                    readOnly={readOnly}
                    autoComplete={autoComplete}
                    required={required}
                    onChange={(e) => handleChange(e)}
                />
            </div>
            {message && (
                <p className={`text-sm text-red-600 mt-2 ${className}`}>
                    {message}
                </p>
            )}
        </>
    );
});
