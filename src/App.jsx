import './App.css'
import {ChatBox} from "./components/ChatBox.jsx";
import {useState, useRef} from "react";
import {InputChat} from "./components/InputChat.jsx";
import Model from "./components/Model.jsx";
import {ChatOllama} from "@langchain/ollama";

function App() {
    const [chats, setChat] = useState([]);
    const canvasContainerRef = useRef(null);
    const modelRef = useRef(null);
    const motions =['w-cute-nod06','w-happy-tilthead03', 'w-happy-forward01']
    const llm = new ChatOllama({
        baseUrl: "http://localhost:11434", // Default value
        model: "qwen3:1.7b",
    });


    function mockStreamAPI(message) {
        const chunks = [
            "Hello",
            ", this ",
            "is a ",
            "mock ",
            "streaming ",
            "response!",
            "fafaf",
            "afadfadfafasfafaf",
            "fasfasfsfasfsafasfasfaf"
        ];

        let i = 0;

        const stream = new ReadableStream({
            pull(controller) {
                if (i < chunks.length) {
                    const chunk = chunks[i];
                    controller.enqueue(new TextEncoder().encode(chunk));
                    i++;
                    // Delay next chunk to simulate streaming
                    return new Promise(resolve => setTimeout(resolve, 300));
                } else {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain" }
        });
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

        for await (const ch of stream){
            botMessage += ch.content;
            setChat(prev => prev.map(msg =>
                msg.id === botId ? { ...msg, txtMsg: botMessage } : msg
            ));
        }

        const audio_link = "https://cdn.jsdelivr.net/gh/RaSan147/pixi-live2d-display@v1.0.3/playground/test.mp3";
        const volume = 1;
        const crossOrigin = "anonymous";

        const category_name = motions[Math.floor(Math.random() * motions.length)];
        model.motion(category_name);


        // ✅ This should work if the model is already initialized and attached to PIXI
        model.speak(audio_link, {
            volume: volume,
            crossOrigin: crossOrigin,
        });
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
                                {chats.map((c)=>{
                                    if (c.sender === 'Me'){
                                        return (<li className="mb-3 flex justify-end pr-2">
                                            <ChatBox txtMsg={c.txtMsg} sender={c.sender} />
                                        </li>)
                                    }else {
                                        return (<li className="mb-3 flex justify-start pr-2">
                                            <ChatBox txtMsg={c.txtMsg} sender="Miku" />
                                        </li>)
                                    }
                                })}
                            </ul>
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
