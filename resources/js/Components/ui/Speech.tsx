import React, {useEffect, useMemo, useState} from "react";
import { useQueue, useSpeech } from "react-text-to-speech";
import Pusher from "pusher-js"

interface SpeechProps {
    message: string;
}
export default function SpeechApp() {
    const [announcement, setAnnouncement] = useState<{ message: string }[]>([]);
    const {
        queue,
    } = useQueue();
    useEffect(() => {
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,  // Ensure secure connection
        });
        pusher.subscribe('channel-queue').bind('queueCall', (data: any) => {
            setAnnouncement(prev => [...prev, data]);
        })
        return () => pusher.unsubscribe('channel-queue');
    }, []);
    useEffect(() => {
        setAnnouncement(prev =>
            prev.filter(item => queue.some(newQueue => newQueue.text === item.message))
        );
    }, [queue]);
    return <div>
        <div style={{display: "flex", flexDirection: "column", rowGap: "1rem"}}>
            {
                announcement.map((item: any, index) => <SpeechItem key={index} message={item.message}/>)
            }
        </div>
    </div>;
}

function SpeechItem({message}: SpeechProps) {
    const text = useMemo(
        () => (
            <>
                <div style={{marginBottom: "0.5rem"}}>{message}</div>
            </>
        ),
        [message]
    );

    const {isInQueue} = useSpeech({
        text, preserveUtteranceQueue: true, autoPlay: true, pitch: 1, rate: 0.6,
        voiceURI:"Microsoft Heera - English (India)",
    });
    return <></>;
}
