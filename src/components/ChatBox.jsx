export  function ChatBox({txtMsg, sender}) {
   return (
       <div className="max-w-xs md:max-w-sm lg:max-w-md p-4  rounded-2xl font-sans text-white transition duration-300 ease-in-out hover:shadow-2xl">
           {/* Header with sender */}
           <div className="flex justify-between items-center mb-3">
               <p className="text-lg md:text-xl font-bold tracking-wide text-white">{sender}</p>
           </div>

           {/* Message bubble */}
           <div className="relative">
               <p className="bg-gradient-to-br from-blue-600 to-blue-400 text-white p-4 rounded-xl shadow-md text-base md:text-lg leading-relaxed">
                   {txtMsg}
               </p>

               {/* Time stamp aligned to bottom right */}
               <p className="text-xs text-white font-mono text-right mt-1.5">
                   {new Date().toLocaleTimeString([], {
                       hour: '2-digit',
                       minute: '2-digit',
                       hour12: true,
                   })}
               </p>
           </div>
       </div>
   )
}