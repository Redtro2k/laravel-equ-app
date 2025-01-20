import react, {useState, Fragment, useEffect, useCallback} from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, usePage, router, Link} from "@inertiajs/react";
import React from "react";
import 'flatpickr/dist/themes/material_blue.css';
import dayjs from 'dayjs';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import FullCalendar from "@fullcalendar/react";
import {isSameDay} from '../../Utils/dateUtils'
import {Dialog, Transition, Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react"; // optional for styling
import clsx from 'clsx'
import Flatpickr from "react-flatpickr";
import debounce from 'lodash/debounce';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'



interface SaProps {
    name: string;
    group_no: number;
}
interface CollectionPage{
    Sa: SaProps[];
}
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

interface SaProps {
    name: string;
    group_no: number;
}
interface PageProps {
    auth: any;
    Sa: SaProps[];
    Vehicles: any;
    select_appointment: any
}
const Appointment: React.FC<PageProps> = ({ auth, Sa, Vehicles, select_appointment }) => {
    const [events, setEvents] = useState([
        {
            title: 'Innova Service',
            start: '2024-12-16T03:00:00+08:00',
            end: '',
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

    const [isLoading, setIsLoading] = React.useState(false);

    const url: string = usePage().url as string;
    //search by date
    const [baseUrl, query] = url.split('?')
    const uri = new URLSearchParams(query)
    const [search, setSearch] = useState<string>(uri.get('search') || '');

    const eventsForSelectedDate = events.filter(
        (event) => event.start.startsWith(selectedDate)
    );


    const updateResult = useCallback(
        debounce((search: string) => {
            setIsLoading(true)
            const uri = new URLSearchParams(query)
            if(search !== '' && search !== null) uri.delete(search)
            uri.set('search', search);

            const newUrl = `${baseUrl}?${uri.toString()}`;
                router.get(newUrl, {}, {
                replace: true,
                preserveState: true,
                onFinish: () => setIsLoading(false),
                only: ['select_appointment']
            })
        }, 300),
        [baseUrl, query]
    );

    const handleDateClick = (info:string) => {
        updateResult(info);
        setShowModel(true)
    }


    const {data, setData, post, errors, processing} = useForm<AppointmentForm>({
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
    const [isSameNumber, setIsSameNumber] = useState<boolean>(false);

    useEffect(() => {
        if (isSameNumber && data.has_viber) {
            setData((prevData) => ({
                ...prevData,
                viber: prevData.contact_number,
            }));
        }
        else if(!data.has_viber){
            setData('viber', '')
        }
    }, [isSameNumber, data.has_viber]);

    const closeModal = () => {
        uri.delete('search')
        const newUrl = `${baseUrl}?${uri.toString()}`;
            router.get(newUrl, {}, {
                replace: true,
                preserveState: true,
                only: ['select_appointment']
            })
        setShowModel(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('appointment.store'), {
            preserveScroll: true
        })
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 px-16">
                <TabGroup className="border-b border-gray-200">
                    <TabList className="-mb-px flex space-x-8">
                        <Tab
                            as={Fragment}>{({hover, selected}) => (
                                <button className={clsx(hover && 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', selected && 'border-indigo-500 font-semibold text-indigo-600', 'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium')}>
                                    Schedule
                                </button>
                        )}</Tab>
                        <Tab
                            as={Fragment}>{({hover, selected}) => (
                            <button className={clsx(hover && 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', selected && 'border-indigo-500 font-semibold text-indigo-600', 'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium')}>
                                Appointment
                            </button>
                        )}</Tab>
                    </TabList>
                    <TabPanels className="pt-8">
                        <TabPanel className="card">
                            <div className="card-body">
                                <FullCalendar
                                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                                    }}
                                    dayMaxEventRows={true}
                                    initialView="dayGridMonth"
                                    events={Vehicles.data}
                                    height={750}
                                    eventDidMount={(event) => {
                                        tippy(event.el, {
                                            content: event.event.extendedProps.description || 'No details available',
                                            placement: 'top',
                                            theme: 'light',
                                        });
                                    }}
                                    eventClick={(event) => {
                                        const eventId = event.event.id;
                                        handleDateClick(eventId)
                                    }}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel className="card">
                            <div className="my-2 card-body">
                                <form className="grid grid-cols-2 gap-4 card-body" onSubmit={handleSubmit}>
                                    {/*customer information*/}
                                    <div className="mt-4">
                                        <h5 className="card-title">Customer</h5>
                                        <div className="pb-4">
                                            <label className="label label-text"> Full name </label>
                                            <input type="text" className="input" placeholder="John Doe"
                                                   onChange={(e) => setData('name', e.target.value)}/>
                                            <span className="label">
                                                <span className="label-text-alt">
                                                    {errors.name && <span className="label-text-alt text-rose-500 font-semibold">*{errors.name}</span>}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="pb-4">
                                        <label className="label label-text">E-mail Address </label>
                                            <input type="email" className="input"
                                                   placeholder="example@email.com"
                                                   onChange={e => setData('email', e.target.value)}/>
                                            {errors.email && <span className="label-text-alt text-rose-500 font-semibold">*{errors.email}</span>}

                                        </div>
                                        <div className="pb-4">
                                            <label className="label label-text">Contact Number </label>
                                            <input type="text" className="input"
                                                   placeholder="09xxxxxxxxx"
                                                   onChange={e => setData('contact_number', e.target.value)}/>
                                            {errors.contact_number && <span className="label-text-alt text-rose-500 font-semibold">*{errors.contact_number}</span>}
                                        </div>
                                        <div className="pb-4">
                                            <label>Has Viber?</label>
                                            <label className=" form-control flex items-center gap-1">
                                                <input type="radio" name="radio-0"
                                                       value="yes"
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
                                                <input type="radio" name="radio-0"
                                                       value="same-as-contact"
                                                       checked={isSameNumber && data.has_viber}
                                                       onChange={(e) => {
                                                           setData('has_viber', true)
                                                           setIsSameNumber(true)
                                                       }}/>
                                                <span className="label cursor-pointer">
                                                            <span className="label-text text-base">Yes, but same as contact number</span>
                                                        </span>
                                            </label>
                                            <label className=" form-control flex items-center gap-1">
                                                <input type="radio" name="radio-0"
                                                       checked={!data.has_viber}
                                                       onChange={(e) => {
                                                           setData('has_viber', false)
                                                           setIsSameNumber(false)
                                                       }}/>
                                                <span className="label cursor-pointer">
                                                            <span className="label-text text-base">No</span>
                                                        </span>
                                            </label>
                                        </div>
                                        <div className="pb-2">
                                            <label className="label label-text">Viber Number</label>
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
                                                   className="input"
                                                   placeholder="09xxxxxxxxx"
                                                   disabled={!isSameNumber && !data.has_viber}/>
                                            {errors.viber && <span className="label-text-alt text-rose-500 font-semibold">*{errors.viber}</span>}

                                        </div>
                                        <div className="pb-4 flex items-center gap-1">
                                            <input type="checkbox"
                                                   className="checkbox [--chkbg:oklch(var(--p))]"
                                                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_senior_or_pwd', e.target.checked)}/>
                                            <label className="label label-text text-base">senior /
                                                pwd</label>
                                        </div>
                                        <div className="pb-2">
                                            <label>source</label>
                                            <input type="text" className="input"
                                                   onChange={e => setData('source', e.target.value)}/>
                                            {errors.source && <span className="label-text-alt text-rose-500 font-semibold">*{errors.source}</span>}
                                        </div>
                                    </div>
                                    {/*vehicle information*/}
                                    <div className="mt-4">
                                        <h5 className="card-title">Vehicle</h5>
                                        <div className="pb-4">
                                            <label className="label label-text">Model</label>
                                            <input type="text" className="input"
                                                   onChange={(e) => setData('model', e.target.value)}/>
                                            {errors.model && <span className="label-text-alt text-rose-500 font-semibold">*{errors.model}</span>}

                                        </div>
                                        <div className="pb-4">
                                            <label className="label label-text">Plate Number</label>
                                            <input type="text"
                                                   className="input"
                                                   onChange={(e) => setData('plate_number', e.target.value)}/>
                                            {errors.plate_number && <span className="label-text-alt text-rose-500 font-semibold">*{errors.plate_number}</span>}

                                        </div>
                                        <div className="pb-4">
                                            <label className="label label-text">CS No</label>
                                            <input type="text"
                                                   className="input"
                                                   onChange={(e) => setData('cs_no', e.target.value)}/>
                                            {errors.cs_no && <span className="label-text-alt text-rose-500 font-semibold">*{errors.cs_no}</span>}

                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="pb-4">
                                                <label className="label label-text">Appointment
                                                    DateTime</label>
                                                <Flatpickr
                                                    id="flatpickr-default"
                                                    options={{
                                                        enableTime: true,
                                                        weekNumbers: true,
                                                        monthSelectorType: 'static',
                                                        time_24hr: false,
                                                        dateFormat: "Y-m-d h:i K"
                                                    }}
                                                    className="input"
                                                    value={data.date_time}
                                                    onChange={(selectedDates: Date[]) => {
                                                        // @ts-ignore
                                                        setData('date_time', dayjs(selectedDates[0]).format('YYYY-MM-DD hh:mm:ss A'))
                                                    }}
                                                />
                                                {errors.date_time && <span className="label-text-alt text-rose-500 font-semibold">*{errors.date_time}</span>}

                                            </div>
                                            <div className="pb-4">
                                                <label className="label label-text"
                                                       htmlFor="favorite-simpson">Select
                                                    Service
                                                    Advisor(SA)</label>
                                                <select
                                                    className="select"
                                                    value={data.sa}
                                                    onChange={(e) => setData('sa', Number(e.target.value))}
                                                >
                                                    {Sa.map((item: any, index: number) => (
                                                        <option key={index} value={item.id}>
                                                            GRP {item.group_no} - {item.name}
                                                        </option>
                                                    ))}
                                                    <option value={0}>
                                                        None
                                                    </option>
                                                </select>
                                                {errors.sa && <span className="label-text-alt text-rose-500 font-semibold">*{errors.sa}</span>}

                                            </div>
                                        </div>
                                        <div className="pb-4">
                                            <label className="label label-text">Selling Dealer</label>
                                            <input type="text"
                                                   className="input"
                                                   onChange={(e) => setData('selling_dealer', e.target.value)}/>
                                            {errors.selling_dealer && <span className="label-text-alt text-rose-500 font-semibold">*{errors.selling_dealer}</span>}

                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <button className="btn btn-primary" disabled={processing}>Create Appointment</button>
                                    </div>
                                </form>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
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
                            <div className="fixed inset-0 bg-black bg-opacity-50"/>
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
                                    <Dialog.Panel
                                        className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 text-gray-900"
                                        >
                                            {
                                                isLoading
                                                    ? <Skeleton count={1}/>
                                                    : <p>
                                                        {select_appointment
                                                        ? select_appointment.data.title
                                                        : null}
                                                    </p>
                                            }
                                        </Dialog.Title>
                                        <div className="w-full pt-4">
                                            <div>
                                                <h6 className="text-lg font-semibold">Schedule Details</h6>
                                                <small>Date
                                                    Arrived: {select_appointment ? select_appointment.data.date_arrival : null}</small>
                                            </div>
                                            {
                                                select_appointment && select_appointment.data.appt_type === 'APPOINTMENT' && isSameDay(select_appointment.data.appointment_date)
                                                    ?
                                                <Link href={route('add.queue')} method="post"
                                                      className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                      data={{ id: select_appointment.data.id, app_date: select_appointment.data.appointment_date}}>Add Queue</Link> : null
                                            }
                                            <hr className="mb-4 mt-2"/>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                                        </div>
                                        {
                                            isLoading
                                                ? <div><Skeleton count={5}/></div>
                                                :
                                                select_appointment
                                                    ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                        <div>
                                                            <label className="label label-text">Name</label>
                                                            <input type="text" value={select_appointment.data.name}
                                                                   className="input" disabled/>
                                                            <span className="error-message">Please enter your name.</span>
                                                            <span className="success-message">Looks good!</span>
                                                        </div>
                                                        <div>
                                                            <label className="label label-text">Plate Number</label>
                                                            <input type="text" value={select_appointment.data.plate}
                                                                   className="input" disabled/>
                                                            <span className="error-message">Please enter your name.</span>
                                                            <span className="success-message">Looks good!</span>
                                                        </div>
                                                        <div>
                                                            <label className="label label-text">Appointment Date</label>
                                                            <input type="text"
                                                                   value={dayjs(select_appointment.data.appointment_date).format('MMMM D, YYYY  h:mm A')}
                                                                   className="input" disabled/>
                                                            <span className="error-message">Please enter your name.</span>
                                                            <span className="success-message">Looks good!</span>
                                                        </div>
                                                        <div>
                                                            <label className="label label-text">CS Number</label>
                                                            <input type="text"
                                                                   value={select_appointment.data.cs_no}
                                                                   className="input" disabled/>
                                                            <span className="error-message">Please enter your name.</span>
                                                            <span className="success-message">Looks good!</span>
                                                        </div>
                                                        <div>
                                                            <label className="label label-text">Service Advisor</label>
                                                            <input type="text"
                                                                   value={select_appointment.data.sa_name}
                                                                   className="input" disabled/>
                                                            <span className="error-message">Please enter your name.</span>
                                                            <span className="success-message">Looks good!</span>
                                                        </div>
                                                    </div>
                                                    : <span>No Selected Appointment</span>
                                        }
                                        <div className="mt-4 flex space-x-2 justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-primary waves waves-primary"
                                                onClick={closeModal}
                                            >
                                                Close
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
// @ts-ignore
export default Appointment;
