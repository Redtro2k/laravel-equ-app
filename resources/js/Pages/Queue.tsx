import React from 'react'
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction'





interface PageProps {
    sas: {
        data: SaUsers[]
    },
    queue?: any
}
interface SaUsers {
    name: string,
    group_no: number,
}
const Queue: React.FC<PageProps> = ({sas, queue}) => {
    console.log(queue)
    return <div>
        <div className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {
                sas.data.map((user, index) => (
                    <div key={index} className="flex flex-col bg-gray-400/5 p-8">
                        <dt className="text-sm font-semibold leading-6 text-gray-600">(SA{user.group_no}){user.name}</dt>
                        <dt className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                            <p>#0000</p>
                        </dt>
                </div>
                ))
            }
        </div>
        <FullCalendar
            plugins={[listPlugin, dayGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: '',
                center: '', // Display the title only
                right: ''
            }}
            titleFormat={{
                year: 'numeric',
                month: 'long',
                day: 'numeric' // Display the full date format
            }}
            initialDate={new Date()} // Focus on the current date
            initialView="listWeek" // Sets the initial view to listWeek
            events={queue.data}
        />
    </div>
}

export default Queue;
