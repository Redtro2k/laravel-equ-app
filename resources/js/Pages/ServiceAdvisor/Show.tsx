import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show(){
    return <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Dashboard
            </h2>
        }
    >
    </AuthenticatedLayout>
}
