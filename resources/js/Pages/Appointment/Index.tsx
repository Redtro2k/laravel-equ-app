import react, {useEffect, useState, Fragment} from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm} from "@inertiajs/react";
import React from "react";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import dayjs from 'dayjs';
import Calendar from '@/Components/Calendar'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import FullCalendar from "@fullcalendar/react";
import {Dialog, Transition} from "@headlessui/react"; // optional for styling


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
    //appointment
    date_time: Date;
    sa: number;
}
interface SaProps {
    name: string;
    group_no: number;
}

interface PageProps {
    auth: any;
    Sa: SaProps[];
}

const Appointment: React.FC<PageProps> = ({ auth, Sa }) => {

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
        selling_dealer: "",
        //appointment
        date_time: new Date(),
        sa: 0
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

    const [events, setEvents] = useState([
        {
            title: 'Innova Service',
            start: '2024-12-16T03:00:00+08:00',
            description: 'Toyota Innova service scheduled.',
        },
        {
            title: 'Corolla Maintenance',
            start: '2024-12-17',
            description: 'Corolla maintenance checkup.',
        },
        {
            title: 'Camry Repair',
            start: '2024-12-15',
            description: 'Camry tire replacement and oil change.',
        },
    ]);
    const [selectedDate, setSelectedDate] = useState('');
    const [showModel, setShowModel] = React.useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
    });


    const eventsForSelectedDate = events.filter(
        (event) => event.start.startsWith(selectedDate)
    );

    const handleDateClick = (info:any) => {
        setSelectedDate(info.dateStr);
        setNewEvent({...newEvent, date: info.dateStr});
        setShowModel(true);
    }
    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            // setEvents([...events, {title: newEvent.title, start: newEvent.date}])
        }
        setShowModel(false); // Close the modal
        setNewEvent({ title: '', date: '' }); // Reset form
    };

    const closeModal = () => {
        setShowModel(false);
        setNewEvent({ title: '', date: '' }); // Reset form
        setSelectedDate('');
    };

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
                                <Flatpickr
                                    id="flatpickr-default"
                                    options={{
                                        enableTime: true,
                                        weekNumbers: true,
                                        monthSelectorType: 'static',
                                        time_24hr: false,
                                        dateFormat: "Y-m-d h:i K"
                                    }}
                                    value={data.date_time}
                                    onChange={(selectedDates: Date[]) => {
                                        // @ts-ignore
                                        setData('date_time', dayjs(selectedDates[0]).format('YYYY-MM-DD hh:mm:ss A'))
                                    }}
                                />
                            </div>
                            <div className="w-96">
                                <label className="label label-text" htmlFor="favorite-simpson">Select Service
                                    Advisor(SA)</label>
                                <select
                                    className="select"
                                    id="favorite-simpson"
                                    value={data.sa}
                                    onChange={(e) => setData('sa', Number(e.target.value))}
                                >
                                    {Sa.map((item: any, index: number) => (
                                        <option key={index} value={item.id}>
                                            GRP {item.group_no} - {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
                {/*<Calendar/>*/}
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    dayMaxEventRows={  true }
                    dateClick={handleDateClick}
                    initialView="timeGridWeek"
                    events={events}
                    eventDidMount={(event) => {
                        tippy(event.el, {
                            content: event.event.extendedProps.description || 'No details available',
                            placement: 'top',
                            theme: 'light',
                        });
                    }}
                />
                <Transition appear show={showModel} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Events on {dayjs(selectedDate).format('MMMM D, YYYY')}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            {eventsForSelectedDate.length > 0 ? (
                                                <ul className="list-disc pl-5">
                                                    {eventsForSelectedDate.map((event, index) => (
                                                        <li key={index} className="mb-2">
                                                            <strong>{event.title}</strong> -{' '}
                                                            {
                                                                event.description
                                                                || 'No details available'}
                                                            {dayjs(event.start).format('hh:mm A')}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500">
                                                    No events scheduled for this day.
                                                </p>
                                            )}

                                            <div className="mt-4">
                                                {/*<input*/}
                                                {/*    type="text"*/}
                                                {/*    placeholder="New Event Title"*/}
                                                {/*    value={newEvent.title}*/}
                                                {/*    onChange={(e) =>*/}
                                                {/*        setNewEvent({ ...newEvent, title: e.target.value })*/}
                                                {/*    }*/}
                                                {/*    className="border border-gray-300 rounded p-2 w-full"*/}
                                                {/*/>*/}
                                                <h5 className="card-title">New Appointment</h5>
                                                <div className="pb-4">
                                                    <label className="label label-text"> Full name </label>
                                                    <input type="text" className="input" placeholder="John Doe"
                                                           onChange={(e) => setData('name', e.target.value)}/>
                                                </div>
                                                <div className="pb-4">
                                                    <label className="label label-text">E-mail Address </label>
                                                    <input type="email" className="input"
                                                           placeholder="example@email.com"
                                                           onChange={e => setData('email', e.target.value)}/>
                                                </div>
                                                <div className="pb-4">
                                                    <label className="label label-text">Contact Number </label>
                                                    <input type="text" className="input"
                                                           placeholder="09xxxxxxxxx"
                                                           onChange={e => setData('contact_number', e.target.value)}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex space-x-2 justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-primary waves waves-primary"
                                                onClick={closeModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary waves waves-light"
                                                onClick={handleAddEvent}
                                            >
                                                Create Appointment
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </AuthenticatedLayout>
    );
}

export default Appointment;
