import React from "react";
import {UsersIcon} from "@heroicons/react/20/solid";
import Badge from '@/Components/ui/badge'

type Customer = {
    data: {
        id: number;
        sa_assigned: number;
        type: string;
        queue_number: number;
        date_issued: string;
        qr_code: string;
        customer_name: string;
        status: Record<string, string>
    }
}
interface Props{
    customer: Customer
}
export default function Show({customer}: Props){
    return <>
        <div className="px-6 py-4">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-6 sm:px-6 flex justify-between">
                    <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-900">{customer.data.type}</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Name: {customer.data.customer_name}</p>
                    </div>
                    <div>
                        <small>Date Issue:<span className="font-semibold">{customer.data.date_issued}</span></small>
                    </div>
                </div>
                <div className="border-t border-gray-100">
                    <dl className="divide-y divide-gray-100"/>
                </div>
                <div className="px-4 py-6 flex justify-center sm:px-6 items-center bg-gray-50">
                    <div>
                        <div className="flex justify-center my-4">
                            <div className="flex flex-col items-center space-y-2">
                                <h1 className="text-5xl font-extrabold">#(SA{customer.data.sa_assigned}){customer.data.queue_number}</h1>
                                <UsersIcon className="w-3/4 text-gray-600"/>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <small className="animate-pulse mb-2">Please be patient and wait for the SA to call you...</small>
                            <Badge text={customer.data.status.text} color={customer.data.status.type as "gray" | "red" | "yellow" | "green" | "blue" | "indigo" | "purple" | "pink"}
                                   size="sm" />
                        </div>
                    </div>
                </div>
        </div>
    </div>
</>
}
