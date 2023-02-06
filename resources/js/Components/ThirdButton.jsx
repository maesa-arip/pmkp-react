export default function ThirdButton({ type = 'submit', className = '', processing, children, onClick }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={
                `inline-flex items-center px-4 py-2 bg-blue-50 border border-transparent rounded-md font-semibold text-xs text-blue-500 uppercase tracking-wide hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    processing && 'opacity-25'
                } ` + className
            }
            disabled={processing}
        >
            {children}
        </button>
    );
}
