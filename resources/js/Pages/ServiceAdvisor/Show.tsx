import React, {useEffect, useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { UsersIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faForward, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import TableList from '@/Components/TableList'
import Pagination from '@/Components/Paginate'
import {usePage, Link} from "@inertiajs/react";
import {PageProps as InertiaPageProps} from "@inertiajs/core";
import toast, { Toaster } from 'react-hot-toast';


type Queue = {
    data: Array<Record<string, any>>; // Replace `Record<string, any>` with the actual data structure
    meta: {
        current_page: number
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>
        last_page: number
        from: number
    };
};

interface User {
    id: number;
    name: string;
    created_at: string;
    roles: string | string[]; // Added missing semicolon
    is_active: number;
    email: string
}

interface CustomPageProps extends InertiaPageProps{
    queues: Queue
    current: any
    next: any
    auth: {
        user: User
    }
    solve: {
        all_completed: number
        all_queue: number
    }
    flash: {
        warning?: string
        success?: string
    }
    // Other props...
}


export default function Show(){
    const pages = usePage<CustomPageProps>().props as CustomPageProps;
    const headers: string[] = pages.queues.data.length > 0 ? Object.keys(pages.queues.data[0]) : [];
    const stats = [
        { name: 'Current', value: pages.current?.data?.queue_no ?? 0 },
        { name: 'Next', value: pages.next?.data?.queue_no ?? 0 },
        { name: 'Finished', value: pages.finished ?? 0 },
        { name: 'Queues', value: pages.solve.all_completed ?? 0, balance: pages.solve.all_queue ?? 0 },
    ]

    console.log(pages.auth?.user.is_active)
    useEffect(() => {
        if(pages.flash?.success) toast.success(pages.flash.success);
        if(pages.flash?.warning) toast(pages.flash.warning, {icon: "⚠️"});
    }, [pages.flash]);
    return <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Dashboard
            </h2>
        }
    >
        <Toaster position="top-right" reverseOrder={false} />
        <div className="py-12 space-y-2">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <h2 className="font-bold uppercase pb-0.5 text-gray-800 pl-0.5">Today</h2>
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="bg-gray-900">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat) => (
                                    <div key={stat.name} className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                                        <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
                                        <p className="mt-2 flex items-baseline gap-x-2">
                                            <span
                                                className="text-4xl font-semibold tracking-tight text-white">{pages.auth?.user.is_active ? stat.value : '--'}</span>
                                            {stat.balance && pages.auth?.user.is_active ?
                                                <span
                                                    className="text-sm text-gray-400 font-semibold">/{stat.balance}</span> : null}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-6 pt-4">
                    <div className="col-span-2 grid grid-cols-2 gap-2 h-1/2">
                        <Link
                            as="button"
                            href={route('queue.set-active')}
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-center text-rose-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            disabled={pages.auth.user.is_active == 1}
                        >
                            <FontAwesomeIcon className="text-6xl py-4" icon={faPlay}/>
                            <p className="text-rose-600 font-bold">Start</p>
                        </Link>
                        <Link
                            href={route('queue.next-customer', 1)}
                            as="button"
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-rose-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            disabled={pages.auth.user.is_active == 0 || pages.queues.data.length === 0}
                        >
                            <FontAwesomeIcon className="text-6xl py-4" icon={faPhone}/>
                            <p className="text-rose-600 font-bold">Call Again</p>
                        </Link>
                        <button
                            type="button"
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-rose-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <FontAwesomeIcon className="text-6xl py-4" icon={faForward} />
                            <p className="text-rose-600 font-bold">Next Customer</p>
                        </button>
                        <Link
                            as="button"
                            href={route('queue.set-inactive')}
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-rose-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            disabled={pages.auth.user.is_active == 0}
                        >
                            <FontAwesomeIcon className="text-6xl py-4" icon={faStop} />
                            <p className="text-rose-600 font-bold">Stop</p>
                        </Link>
                    </div>
                    <div className="col-span-4 overflow-hidden rounded-lg bg-white shadow">
                        <h1 className="pt-4 font-bold text-lg uppercase text-rose-600 pl-7 flex items-end space-x-1">
                            <UsersIcon className="h-7"/>  <p>Customer who preferred you</p></h1>
                        <div className={pages.auth.user.is_active != 1 ? "opacity-50" : ""}>
                            <TableList
                                headers={headers}
                                records={pages.queues.data}
                                emptySpan="No Customer for Today!"
                                selectedTab="queue_no"
                                currentTab={pages.current?.data?.queue_no}
                            />
                            <div className="pb-4 px-8">
                                <Pagination
                                    meta={pages.queues.meta}
                                    current={pages.queues.meta.current_page}
                                    lastPage={pages.queues.meta.last_page}
                                    from={pages.queues.meta.from}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 overflow-hidden rounded-lg bg-white shadow">
                        <h1 className="pt-4 font-bold text-lg uppercase text-rose-600 pl-7 flex items-end space-x-1">
                            <UsersIcon className="h-7"/>  <p>Customer Received</p></h1>
                            <TableList
                                headers={headers}
                                records={pages.queues.data}
                            />
                            <div className="pb-4 px-8">
                                <Pagination
                                    meta={pages.queues.meta}
                                    current={pages.queues.meta.current_page}
                                    lastPage={pages.queues.meta.last_page}
                                    from={pages.queues.meta.from}
                                />
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}
