import react, {useEffect, useState} from 'react'
import PropagateLoader from "react-spinners/PropagateLoader";
import React from "react";



interface LoadingProps {
    color?: string
}

const loadingMessages = [
    "Diagnosing the issue... probably 'customer states check engine light is on'!",
    "Loading... just like waiting for parts to arrive!",
    "Checking for recalls... and any hidden surprises!",
    "Service bay is full... please wait in the lounge!",
    "Waiting for approval… just like every warranty claim!",
    "Running a multi-point inspection... on your patience!",
    "Just like a customer waiting for an oil change… this might take a bit!",
    "Trying to explain the estimate… but it's still loading!",
    "Your data is on backorder… please stand by!",
    "Verifying labor hours… but the tech is still at lunch!",
    "Almost ready... but the technician is still looking for that 'mystery noise'!",
];

const Loading = ({color = "oklch(0.645 0.246 16.439)"}: LoadingProps) => {
    const [message, setMessage] = useState("")

    useEffect(() => {
        setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, [message])
    return <div className="flex flex-col items-center justify-center">
        <p className="text-rose-600 text-sm font-bold">{message}</p>
        <PropagateLoader color={color}/>
    </div>
}

export default Loading;
