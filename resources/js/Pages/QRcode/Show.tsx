import React from "react";
import {usePage} from '@inertiajs/react'
import {PageProps as InertiaPageProps} from "@inertiajs/core";
import {ReactQRCode} from "@lglab/react-qr-code";

// Define the Receipt type properly
interface Receipt {
    data: {
        current_time: string; // Use lowercase `string`
        customer_name: string;
        id: number;
        qr_code: string | string[];
        queue_number: string;
        type: string;
    };
}

interface CustomerPageProps extends InertiaPageProps {
    receipt: Receipt;
}

export default function Show() {
    const { receipt } = usePage<CustomerPageProps>().props;
    console.log(receipt)
    return <>
        <div className="px-2 border flex justify-center border-gray-700 w-64">
            <div className="text-center my-4">
                <h1 className="font-extrabold text-3xl">#{String(receipt.data.queue_number)}</h1>
                <ReactQRCode value={receipt.data.qr_code} size={200}/>
                <div className="flex justify-center">
                    <h2 className="font-extrabold">{receipt.data.type}</h2>
                </div>
                    <small className="text-gray-600">{receipt.data.current_time}</small>
            </div>
        </div>

    </>
}
