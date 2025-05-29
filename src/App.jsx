import './App.css'
import {ChatBox} from "./components/ChatBox.jsx";
import {useState, useRef, useEffect} from "react";
import {InputChat} from "./components/InputChat.jsx";
import Model from "./components/Model.jsx";
import {ChatOllama} from "@langchain/ollama";
import axios from "axios";

function App() {
    const [chats, setChat] = useState([]);
    const canvasContainerRef = useRef(null);
    const modelRef = useRef(null);
    const messagesEndRef = useRef(null);
    const motions =['w-cute-nod06','w-happy-tilthead03', 'w-happy-forward01']
    const llm = new ChatOllama({
        baseUrl: "http://localhost:11434", // Default value
        model: "qwen3:1.7b",
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);


    async function handleAddChat(input) {
        setChat(prev => [...prev, input]);

        const model = modelRef.current;
        if (!model) {
            console.warn('Model not initialized yet.');
            return;
        }

        const botId = Date.now();
        setChat(prev => [...prev, { id: botId, sender: "Miku", txtMsg: "..." }]);

        const llm = new ChatOllama({
            baseUrl: "http://localhost:11434",
            model: "qwen3:1.7b",
        });

        const stream = await llm.stream([["human", input.txtMsg]]);

        let botMessage = "";
        let botChunkMessage = []

        for await (const ch of stream) {
            botMessage += " " + ch.content;
            botChunkMessage.push(ch.content)
        }

        const res = await axios.post("http://localhost:8000/tts", { data: botMessage });

        let streamMessage = ""

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for await (const c of botChunkMessage){
            streamMessage +=c

            // Update chat
            setChat(prev => prev.map(msg =>
                msg.id === botId ? { ...msg, txtMsg: streamMessage } : msg
            ));

            await delay(300)

            model.motion("w-cute-nod06");

            const volume = 1;
            const crossOrigin = "anonymous";

            model.speak("public/audio/sound.wav", {
                volume: volume,
                crossOrigin: crossOrigin,
            });
        }

        await axios.delete("http://localhost:8000/audio", {});
    }

    return (
        <div className="bg-[url('./assets/bg.jpg')] min-h-screen w-full bg-cover">
            <div className="flex min-h-screen">
                <div className="w-1/2">
                    <div id="canvas-container" ref={canvasContainerRef} className="h-screen">
                        <Model containerRef={canvasContainerRef} modelRef={modelRef}/>
                    </div>
                </div>

                <div className="w-1/2 h-screen flex flex-col px-6">
                    {/* Chat panel */}
                    <div className="flex flex-col flex-1 border rounded-lg shadow-lg overflow-hidden backdrop-blur-sm m-2.5">

                        {/* Scrollable message area */}
                        <div className="flex-1 overflow-y-auto p-2">
                            <ul>
                                {chats.map((c, idx) => (
                                    <li key={idx} className={`mb-3 flex ${c.sender === 'Me' ? 'justify-end' : 'justify-start'} pr-2`}>
                                        <ChatBox txtMsg={c.txtMsg} sender={c.sender === 'Me' ? 'Me' : 'Miku'} />
                                    </li>
                                ))}
                            </ul>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Fixed input area */}
                        <div className="border-t px-4 py-3 bg-white">
                            <InputChat handleAdd={handleAddChat}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
