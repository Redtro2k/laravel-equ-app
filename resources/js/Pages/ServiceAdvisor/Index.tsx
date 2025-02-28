import React, {useEffect, useState} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {greetings} from '@/Utils/dateUtils'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhone, faPlay, faStop} from "@fortawesome/free-solid-svg-icons";
import {Link} from '@inertiajs/react'
import TableList from "@/Components/TableList";
import {UsersIcon} from "@heroicons/react/20/solid";
import Modal from '@/Components/Modal'
import Paginate from '@/Components/Paginate'
import axios from "axios";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';




type TypeOfQueues = {
    walkin: number;
    appointment: number;
}

type Queries = {
    data: Array<Record<string, any>>;
    meta: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        per_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

type ToDayTotal = {
    finished: number;
    remaining: number;
}
interface IndexProps {
    queries: Queries
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
    const headers: string[] = ['queue_no', 'plate_number', 'cs', 'vehicle_model', 'time'];
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false)

    const stats = [
        {name: 'Current', value: current?.data?.queue_no ?? '--' },
        {name: 'Next', value: next?.data?.queue_no ?? '--' },
        {name: 'Appointment / Walk-In', value: type_of_queues.appointment, balance: type_of_queues.walkin},
        {name: 'Queries', value: today_queries_count.remaining ?? '--'},
    ]


    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.warning) toast(flash.warning, { icon: "⚠️" });
    }, [flash]);

    const handleRowSelect = async (item: any) => {
        setLoading(true)
        try{
            const response = await axios.get(`/api/appointment/${item.appointment_id}`);
            setSelectedItem(response.data);
        } catch (error) {
            console.error("Error fetching appointment:", error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        console.log(loading)
    }, [loading]);

    return <AuthenticatedLayout
        header={
            <div>
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {greetings() + ' ' + auth.user.name}
                </h2>
            </div>
        }
    >
        <Toaster position="top-right" reverseOrder={false}/>
        <Modal show={!!selectedItem} onClose={() => setSelectedItem(null)}>
            {
                loading ? (<p>Loading...</p>) : selectedItem ? (
                    <div>
                        <h1>Existed</h1>
                    </div>
                ) : null
            }
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Are you sure you want to delete your account?
                </h2>
            </div>
        </Modal>
        <div className="grid grid-cols-2 grid-rows-3 gap-4 py-16 px-24">
            <div className="row-span-3">
                <h2 className="font-bold uppercase pb-0.5 text-gray-800 pl-0.5"></h2>
                <div className="overflow-hidden bg-gray-400 shadow-sm sm:rounded-lg">
                    <div className="bg-gray-900">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="col-span-5 bg-gray-800 py-1.5 text-center font-semibold text-white">Today</div>
                                {stats.map((stat) => (
                                    <div key={stat.name} className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                                        <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
                                        <p className="mt-2 flex items-baseline gap-x-2">
                                            <span
                                                className="text-2xl font-semibold tracking-tight text-white">{auth?.user.is_active ? stat.value : '--'}</span>
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
                <div className="grid grid-cols-6 gap-6 mt-4">
                    <div className="col-span-6 grid grid-cols-4 gap-2">
                        <Link
                            as="button"
                            href={route('queue.set-active', current?.data?.appointment_id)}
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-center text-rose-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            disabled={auth.user.is_active == 1}
                        >
                            <FontAwesomeIcon className="text-6xl py-4" icon={faPlay}/>
                            <p className="text-rose-600 font-bold">Start</p>
                        </Link>
                        {
                            current?.data?.appointment_id ?
                                <Link
                                    href={route('queue.call-again', current?.data?.appointment_id)}
                                    as="button"
                                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-rose-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                                    disabled={auth.user.is_active == 0 || current?.data?.appointment_id == null}>
                                    <FontAwesomeIcon className="text-6xl py-4" icon={faPhone}/>
                                    <p className="text-rose-600 font-bold">Call Again</p>
                                </Link>
                            : null
                        }
                        <Link
                            as="button"
                            href={route('queue.set-inactive')}
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-rose-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            disabled={auth.user.is_active == 0}
                        >
                            <FontAwesomeIcon className="text-6xl py-4" icon={faStop} />
                            <p className="text-rose-600 font-bold">Stop</p>
                        </Link>
                    </div>
                    </div>
                </div>
            <div>
                <div className="col-span-4 overflow-hidden rounded-lg bg-white shadow">
                    {loading ? (
                        // Maintain the same height while loading
                        <div className="h-[500px] flex items-center justify-center">
                            <p>Loading</p>
                        </div>
                    ) : (
                        <div>
                            <h1 className="pt-4 font-bold text-lg uppercase text-rose-600 pl-7 flex items-end space-x-1">
                                <UsersIcon className="h-7"/>
                                <p>Customer who preferred you</p>
                            </h1>
                            <div className={auth.user.is_active != 1 ? "opacity-50" : ""}>
                                <TableList
                                    headers={headers}
                                    records={queries.data}
                                    emptySpan="No Customer for Today!"
                                    selectedTab="queue_no"
                                    currentTab={current?.data?.queue_no}
                                    onRowSelect={handleRowSelect}
                                />
                                <div className="pb-4 px-8">
                                    <Paginate
                                        meta={queries.meta}
                                        current={queries.meta.current_page}
                                        lastPage={queries.meta.last_page}
                                        from={queries.meta.from}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}
