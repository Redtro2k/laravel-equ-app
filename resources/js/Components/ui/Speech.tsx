import React, {useEffect, useMemo, useState} from "react";
import { useSpeech } from "react-text-to-speech";
import Pusher from "pusher-js"

interface SpeechProps {
    desc: string;
}
export default function SpeechApp() {
    const news:[] = []

    const [queue, setQueue] = useState<string[]>([]);
    useEffect(() => {
        console.log("Connecting to Pusher...");

        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,  // Ensure secure connection
        });
        pusher.subscribe('channel-queue').bind('queueCall', (data: any) => {
            console.log(data);
        })
    }, []);
    // @ts-ignore
    return <div>
        <div style={{display: "flex", flexDirection: "column", rowGap: "1rem"}}>
            {news.length > 0 ? (
                news.map((desc, index) => <SpeechItem key={index} desc={desc}/>)
            ) : (
                <p>No news available.</p> // Fallback message when empty
            )}
        </div>
    </div>;
}

function SpeechItem({desc}: SpeechProps) {
    const text = useMemo(
        () => (
            <>
                <div style={{marginBottom: "0.5rem"}}>{desc}</div>
            </>
        ),
        [desc]
    );

    const {} = useSpeech({
        text, preserveUtteranceQueue: true, autoPlay: true, pitch: 1, rate: 0.8,
        voiceURI: "Microsoft Heera - English (India)",
        onQueueChange: (query) => {
            console.log(query)
        }});

    return (
        <div>
        </div>
    )
}
