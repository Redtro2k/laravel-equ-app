import React, {useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {greetings} from '@/Utils/dateUtils'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhone, faPlay, faStop} from "@fortawesome/free-solid-svg-icons";
import {Link, router} from '@inertiajs/react'
import TableList from "@/Components/TableList";
import Modal from '@/Components/Modal'
import Paginate from '@/Components/Paginate'
import axios from "axios";
import LoadingComponent from '@/Components/ui/Loading'
import Badge from '@/Components/ui/badge'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'

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

interface SelectedItem{
    appointment?: {
        appointment_id: number;
        queue_no: string;
        app_type: string;
        is_preferred: boolean;
        plate_number: string;
        time: string;
        cs: number;
        vehicle_model: string;
        comment: string
    }
    customer?: {
        is_senior_or_pwd: boolean;
        name: string;
        contact_number: number;
        email: string;
        source: string;
    }
}


export default function IndexPage({queries, current, next, flash, auth, today_total_queries, today_queries_count, type_of_queues}: IndexProps) {

    const headers: string[] = ['queue_no', 'plate_number', 'cs', 'vehicle_model', 'time'];
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
    const [loading, setLoading] = useState(false);


    const stats = [
        {name: 'Current', value: current?.data?.queue_no ?? '--' },
        {name: 'Next', value: next?.data?.queue_no ?? '--' },
        {name: 'Appointment / Walk-In', value:type_of_queues.appointment , balance: type_of_queues.walkin},
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
        console.log(selectedItem)
    }, [selectedItem]);

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
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-6 sm:px-6">
                    <div className="flex justify-between">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">View ID {selectedItem?.appointment?.queue_no}</h3>
                        <div className="flex space-x-1">
                            {selectedItem?.appointment?.app_type ? <Badge text={selectedItem?.appointment?.app_type ?? 'N/A'} size="sm" color="gray" /> : null}
                            {selectedItem?.appointment?.is_preferred ? <Badge text="PREFERRED YOU" size="sm" color="indigo" /> : null}
                            {selectedItem?.customer?.is_senior_or_pwd ? <Badge text="PWD" size="sm" color="blue" /> : null}
                        </div>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Customer details and application.</p>
                </div>
                <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{selectedItem?.customer?.name}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt className="text-sm font-medium leading-6 text-gray-900">E-mail</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{selectedItem?.customer?.email}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Contact Number</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{selectedItem?.customer?.contact_number}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt className="text-sm font-medium leading-6 text-gray-900">{selectedItem?.appointment?.app_type} DateTime</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{selectedItem?.appointment?.time}</dd>
                        </div>
                        <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt className="text-sm font-medium leading-6 text-gray-900">CS Number</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{selectedItem?.appointment?.cs}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Remarks</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <div dangerouslySetInnerHTML={{__html: selectedItem?.appointment?.comment ?? ""}}/>
                            </dd>
                        </div>
                    </dl>
                    <div className="flex space-x-2 py-2 pr-2 justify-end">
                        <SecondaryButton onClick={() => setSelectedItem(null)}>Close</SecondaryButton>
                        <PrimaryButton onClick={() => {
                            let handle_id = selectedItem?.appointment?.appointment_id;
                            setSelectedItem(null)
                            router.get(`/queue?choose=${handle_id}`)
                        }} disabled={!auth.user.is_active}>Select This Queue</PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
        <div className="grid grid-cols-2 grid-rows-3 gap-4 py-16 px-24">
            <div className="row-span-3">
                <div className="overflow-hidden bg-gray-400 shadow-sm sm:rounded-lg">
                    <div className="bg-gray-900">
                    <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
                                <div
                                    className="col-span-5 bg-gray-800 py-1.5 text-center font-semibold text-white">Today
                                </div>
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
                            <div>
                              <LoadingComponent />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="pt-4 font-bold items-center flex-col uppercase text-rose-600 pl-7 flex space-x-1">
                                Customer Queries For Today!
                            </div>
                            <div className="sweet-loading">
                            </div>
                            <div>
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
