import React from 'react'
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction'
import SpeechApp from '@/Components/ui/Speech'

interface PageProps {
    sas: {
        data: SaUsers[]
    },
    queue?: any
}
interface SaUsers {
    name: string,
    group_no: number,
    plate: string,
    current_assigned_customer: string
}

const Queue: React.FC<PageProps> = ({ sas, queue }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white p-6">

            {/* ✅ HEADER VIDEO AREA */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full sm:w-1/2 h-64 rounded-2xl object-cover shadow-lg border-2 border-red-500"
                >
                    <source src="/storage/playback1.mp4" type="video/mp4" />
                </video>

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full sm:w-1/2 h-64 rounded-2xl object-cover shadow-lg border-2 border-red-500"
                >
                    <source src="/storage/playback2.mp4" type="video/mp4" />
                </video>
            </div>

            {/* ✅ CURRENT ASSIGNED QUEUE */}
            <h2 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase tracking-wide">
                Now Serving
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {sas.data.map((user, index) => (
                    <div key={index} className="bg-white border-t-8 border-red-600 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center hover:scale-105 transition">
                        <p className="text-base font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                            Group {user.group_no}
                        </p>
                        <h3 className="text-4xl font-bold text-red-600 mb-2">
                            {user.current_assigned_customer || "-"}
                        </h3>
                        <p className="text-sm text-gray-700">{user.name}</p>
                    </div>
                ))}
            </div>

            {/* ✅ TEXT-TO-SPEECH ANNOUNCER */}
            <div className="mb-16">
                <SpeechApp />
            </div>

            {/* ✅ UPCOMING QUEUE */}
            <h2 className="text-3xl font-bold text-center mb-8 text-red-600 uppercase tracking-wide">
                Upcoming Customers
            </h2>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
                <FullCalendar
                    plugins={[listPlugin, dayGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: '',
                        center: 'title',
                        right: ''
                    }}
                    titleFormat={{
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }}
                    height={750}
                    initialDate={new Date()}
                    initialView="listDay"
                    events={queue?.data || []}
                />
            </div>

        </div>
    )
}

export default Queue
