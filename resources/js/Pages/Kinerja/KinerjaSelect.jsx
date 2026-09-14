import React from 'react';
import Select from '@/Components/ui/Select';

export default function KinerjaSelect(props) {
    return <Select {...props} wrapLabels
        className="w-full min-w-0"
        buttonClassName="!h-auto min-h-[44px] !rounded-xl !border-slate-300 !bg-white !py-2.5 !font-medium dark:!border-slate-700 dark:!bg-slate-900"
    />;
}
