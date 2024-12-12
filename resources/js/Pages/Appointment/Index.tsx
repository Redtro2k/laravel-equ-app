import react, {useEffect, useState} from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm} from "@inertiajs/react";
import {PageProps} from "@/types";
import React from "react";
import flatpickr from "flatpickr";


interface AppointmentForm {
    // appointment
    name: string;
    email: string;
    contact_number: string;
    has_viber: boolean;
    viber?: string;
    is_senior_or_pwd?: boolean;
    source: string;
    //vehicle
    model: string;
    plate_number: string;
    cs_no: string;
    selling_dealer?: string;
}


const Appointment = ({auth}: PageProps) => {
    const [datetime, setDateTime] = useState(new Date());
    const {data, setData, post, errors} = useForm<AppointmentForm>({
        name: '',
        contact_number: "",
        email: "",
        has_viber: false,
        is_senior_or_pwd: false,
        viber: "",
        source: "",
        // vehicles
        model: "",
        plate_number: "",
        cs_no: "",
        selling_dealer: ""
    })
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('appointment.store'))
    }

    const [isSameNumber, setIsSameNumber] = useState<boolean>(false);

    useEffect(() => {
        if (isSameNumber && data.has_viber) {
            setData((prevData) => ({
                ...prevData,
                viber: prevData.contact_number,
            }));
        }
    }, [isSameNumber, data.has_viber]);

    window.addEventListener('load', function () {
        // Basic
        flatpickr('#flatpickr-date', {
            monthSelectorType: 'static'
        })
    })

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <form onSubmit={handleSubmit}>

                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex space-x-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h1>New Appointment</h1>
                                <div>
                                    <label>name</label>
                                    <input type="text" onChange={(e) => setData('name', e.target.value)}/>
                                </div>
                                <div>
                                    <label>email</label>
                                    <input type="email" onChange={e => setData('email', e.target.value)}/>
                                </div>
                                <div>
                                    <label>contact number</label>
                                    <input type="text" onChange={e => setData('contact_number', e.target.value)}/>
                                </div>
                                <div>
                                    <label>Has Viber?</label>
                                    <label className=" form-control flex items-center gap-1">
                                        <input type="radio" name="radio-0" className="radio" value="yes"
                                               checked={!isSameNumber && data.has_viber}
                                               onChange={(e) => {
                                                   setData('has_viber', true)
                                                   setIsSameNumber(false)
                                                   setData('viber', '')
                                               }}
                                        />
                                        <span className="label cursor-pointer">
                                        <span className="label-text text-base">Yes</span>
                                      </span>
                                    </label>
                                    <label className=" form-control flex items-center gap-1">
                                        <input type="radio" name="radio-0" className="radio" value="same-as-contact"
                                               checked={isSameNumber && data.has_viber} onChange={(e) => {
                                            setData('has_viber', true)
                                            setIsSameNumber(true)
                                        }}/>
                                        <span className="label cursor-pointer">
                                        <span className="label-text text-base">Yes, but same as contact number</span>
                                    </span>
                                    </label>
                                    <label className=" form-control flex items-center gap-1">
                                        <input type="radio" name="radio-0" className="radio" checked={!data.has_viber}
                                               onChange={(e) => {
                                                   setData('has_viber', false)
                                                   setIsSameNumber(false)
                                               }}/>
                                        <span className="label cursor-pointer">
                                        <span className="label-text text-base">No</span>
                                    </span>
                                    </label>
                                </div>
                                <div>
                                    <label>Viber Number</label>
                                    <input type="text"
                                           value={data.viber}
                                           onChange={e => {
                                               const value = e.target.value;

                                               setData((prevData) => ({
                                                   ...prevData,
                                                   viber: value,
                                                   has_viber: true,
                                               }));
                                               setIsSameNumber(value === data.contact_number);
                                           }}
                                           disabled={!isSameNumber && !data.has_viber}/>
                                </div>
                                <div>
                                    <label>senior / pwd</label>
                                    <input type="checkbox" className="checkbox [--chkbg:oklch(var(--p))]"
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_senior_or_pwd', e.target.checked)}/>
                                </div>
                                <div>
                                    <label>source</label>
                                    <input type="text"/>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h1>Vehicle</h1>
                                <div>
                                    <label>Model</label>
                                    <input type="text" onChange={(e) => setData('model', e.target.value)}/>
                                </div>
                                <div>
                                    <label>Plate Number</label>
                                    <input type="text" onChange={(e) => setData('plate_number', e.target.value)}/>
                                </div>
                                <div>
                                    <label>CS No</label>
                                    <input type="text" onChange={(e) => setData('cs_no', e.target.value)}/>
                                </div>
                                <div>
                                    <label>Selling Dealer</label>
                                    <input type="text" onChange={(e) => setData('selling_dealer', e.target.value)}/>
                                </div>
                            </div>
                            <div className="p-6 text-gray-900">
                                <h1>Appointment DateTime</h1>
                                <input type="text" className="input max-w-sm" placeholder="YYYY-MM-DD"
                                       id="flatpickr-date"/>

                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>

            </div>
        </AuthenticatedLayout>
    );
}

export default Appointment;
