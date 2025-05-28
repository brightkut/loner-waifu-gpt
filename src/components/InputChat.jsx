import {SendHorizonal} from "lucide-react";

export function InputChat(){
    return (
        <div className="bg-white rounded-b-md px-4 py-2 flex items-center gap-2 shadow-md">
            <input
                type="text"
                placeholder="Chat message"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition duration-200"
            >
                <SendHorizonal/>
            </button>
        </div>
    )
}