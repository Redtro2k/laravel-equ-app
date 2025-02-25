import React, {useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {greetings} from '@/Utils/dateUtils'


type TypeOfQueues = {
    walkin: number;
    appointment: number;
}

type ToDayTotal = {
    finished: number;
    remaining: number;
}
interface IndexProps {
    queries: any
    current: any,
    next: any,
    auth: any,
    flash?: {
        success?: string,
        warning?: string
    },
    today_total_queries: number;
    type_of_queues: TypeOfQueues,
    today_queries_count: ToDayTotal

}



export default function IndexPage({queries, current, next, flash, auth, today_total_queries, today_queries_count, type_of_queues}: IndexProps) {
    const headers: string[] = ['queue_no', 'plate_number', 'cs', 'vehicle_model', 'time', 'appointment_id'];

    const stats = [
        {name: 'Current', value: current?.data?.queue_no ?? '--' },
        {name: 'Next', value: next?.data?.queue_no ?? '--' },
        {name: 'Total Today', value: today_total_queries ?? '--'},
        {name: 'Appointment / Walk-In', value: type_of_queues.appointment, balance: type_of_queues.walkin},
        {name: 'Today Remaining / Queries', value: today_queries_count.remaining, balance: today_queries_count.finished },
    ]

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.warning) toast(flash.warning, { icon: "⚠️" });
    }, [flash]);

    return <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                {greetings() + ' ' + auth.user.name}
            </h2>
        }
    >
        <Toaster position="top-right" reverseOrder={false}/>
        <div className="grid grid-cols-2 grid-rows-3 gap-4 mt-4">
            <div className="row-span-3">
                <h2 className="font-bold uppercase pb-0.5 text-gray-800 pl-0.5"></h2>
                <div className="overflow-hidden bg-gray-400 shadow-sm sm:rounded-lg">
                    <div className="bg-gray-900">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat) => (
                                    <div key={stat.name} className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                                        <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
                                        <p className="mt-2 flex items-baseline gap-x-2">
                                            <span
                                                className="text-4xl font-semibold tracking-tight text-white">{auth?.user.is_active ? stat.value : '--'}</span>
                                            {stat.balance && auth?.user.is_active ?
                                                <span
                                                    className="text-sm text-gray-400 font-semibold">/{stat.balance}</span> : null}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="font-semibold">table for all queries</h1>
            </div>
        </div>
    </AuthenticatedLayout>
}
