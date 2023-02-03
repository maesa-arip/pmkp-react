import Container from '@/Components/Container';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import App from '../Layouts/App';

export default function Dashboard(props) {
    return (
       <>
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="mx-auto">
                    <div className="overflow-hidden bg-white border shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div>
                </div>
            </div>
            </>
    );
}
Dashboard.layout = (page) => <App children={page} />;
