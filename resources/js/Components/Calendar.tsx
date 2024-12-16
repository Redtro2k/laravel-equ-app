import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { Dialog, Transition } from '@headlessui/react';
import React, {Fragment, useState} from "react";
import dayjs from "dayjs";



const Calendar = () => {
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


    return <div>
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
                                        <input
                                            type="text"
                                            placeholder="New Event Title"
                                            value={newEvent.title}
                                            onChange={(e) =>
                                                setNewEvent({ ...newEvent, title: e.target.value })
                                            }
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
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
    </div>;
};
export default Calendar;
