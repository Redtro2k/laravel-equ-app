import React, {useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';

interface IndexProps {
    queries: any
    current: any,
    next: any,
    flash?: {
        success?: string,
        warning?: string
    }
}



export default function IndexPage({queries, current, next, flash}: IndexProps) {

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.warning) toast(flash.warning, { icon: "⚠️" });
    }, [flash]);

    return <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Dashboard
            </h2>
        }
    >
        <Toaster position="top-right" reverseOrder={false} />
    </AuthenticatedLayout>
}
