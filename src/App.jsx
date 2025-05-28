import './App.css'
import {ChatBox} from "./components/ChatBox.jsx";
import {useState, useRef} from "react";
import {InputChat} from "./components/InputChat.jsx";
import Model from "./components/Model.jsx";
import {Live2DModel} from "pixi-live2d-display-lipsyncpatch";
import * as PIXI from "pixi.js";

function App() {
    const [chats, setChat] = useState([]);
    const canvasContainerRef = useRef(null);
    const modelRef = useRef(null);

    async function handleAddChat(){
        // setChat(prevState => {
        //     // Add chat handling logic here
        // });

       const model = modelRef.current;
        if (!model) {
            console.warn('Model not initialized yet.');
            return;
        }

        const audio_link = "https://cdn.jsdelivr.net/gh/RaSan147/pixi-live2d-display@v1.0.3/playground/test.mp3";
        const volume = 1;
        const crossOrigin = "anonymous";

        const category_name = 'w-cute-nod06';
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
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi, I am Miku." sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi again!" sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi again!" sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi again!" sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi again!" sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi again!" sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi again!" sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-end pr-2">
                                    <ChatBox txtMsg="Hi again!" sender="Miku" />
                                </li>
                                <li className="mb-3 flex justify-start pr-2">
                                    <ChatBox txtMsg="Hi, I am Miku." sender="Miku" />
                                </li>
                                {/* more messages */}
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
