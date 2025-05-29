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


    async function sendToTTS(dataArray) {
        try {
            const res = await axios.post("http://127.0.0.1:5000/tts", {data: dataArray});
            console.log(res.data.path);
            return res.data.path;
        } catch (err) {
            console.error("TTS error:", err);
        }
    }

    async function handleAddChat(input){
        setChat(prevState => {
           return [...prevState, input]
        });

       const model = modelRef.current;
        if (!model) {
            console.warn('Model not initialized yet.');
            return;
        }

        const botId = Date.now(); // Unique ID for the bot's message
        setChat(prev => [...prev, { id: botId, sender: "Miku", txtMsg: "" }]);

        let botMessage = "";

        const stream = await  llm.stream([["human", input.txtMsg]])

        let data = []
        for await (const ch of stream){
            data.push(ch.content)
            console.log(ch.content)
        }
        console.log(data)

        let path = await sendToTTS(data)

        for (let i = 0; i < data.length; i++) {
            const ch = data[i];
            botMessage += ch;

            setChat(prev =>
                prev.map(msg =>
                    msg.id === botId ? { ...msg, txtMsg: botMessage } : msg
                )
            );

            const category_name = motions[Math.floor(Math.random() * motions.length)];

            model.motion(category_name);

            const volume = 1;
            const crossOrigin = "anonymous";

            model.speak(path, {
                volume: volume,
                crossOrigin: crossOrigin,
            });
        }
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
