import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import {greetings} from "@/Utils/dateUtils";

interface Authenticated {
    role: Array<string>;
    user: any;
}

export default function Dashboard() {
    const auth  = usePage<{auth: Authenticated}>().props.auth;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {greetings() + ' ' + auth.user.name}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {auth.role.includes('receptionist') ?
                                <>
                                    <h1 className="text-2xl pb-2 font-semibold text-gray-500">Report Extraction</h1>
                                    <div className="grid grid-cols-5 gap-2">
                                        <a href="/up-appointment?isTomorrow=true"
                                           className="flex flex-col items-center gap-y-2 rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                            <FontAwesomeIcon
                                                className="h-24 w-24"
                                                icon={faFileExport}/>
                                            Data Tomorrow's Appointment
                                        </a>
                                        <a href="/up-appointment"
                                           className="flex flex-col items-center gap-y-2 rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                            <FontAwesomeIcon
                                                className="h-24 w-24"
                                                icon={faFileExport}/>
                                            Data Upcoming Appointments
                                        </a>
                                    </div>
                                </>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
)
;
}
