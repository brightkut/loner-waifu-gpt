import './App.css'
import {ChatBox} from "./components/ChatBox.jsx";
import {useState, useRef} from "react";
import {InputChat} from "./components/InputChat.jsx";
import Model from "./components/Model.jsx";

function App() {
    const [chats, setChat] = useState([]);
    const canvasContainerRef = useRef(null);

    function handleAddChat(){
        setChat(prevState => {
            // Add chat handling logic here
        });
    }

    return (
        <div className="bg-[url('./assets/bg.jpg')] min-h-screen w-full bg-cover">
            <div className="flex min-h-screen">
                <div className="w-1/2">
                    <div id="canvas-container" ref={canvasContainerRef} className="h-screen">
                        <Model containerRef={canvasContainerRef} />
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
                            <InputChat />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
