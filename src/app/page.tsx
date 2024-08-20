"use client";

// Imports
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

// CSS helper functions
function getJustifyContent(messageRole: string): Style {
  const flexType = (messageRole === "assistant") ? "start" : "end";
  return { justifyContent: `flex-${flexType}` };
}

function getBackgroundColor(messageRole: string): Style {
  const bgColorType = (messageRole === "assistant") ? "rgb(142 142 147)" : "rgb(55 65 81)";
  return { backgroundColor: bgColorType };
}

// Main component to export
export default function Home(): JSX.Element {

  // Creating state variables
  const [ messages, setMessages ]: [ Message[], Dispatch<SetStateAction<Message[]>> ] = useState([{
    role: "assistant",
    content: "Hi! I'm the Headstarter fitness assistant. How can I help you today?"
  }]);
  const [ message, setMessage ] = useState("");

  // Sends user message to backend, returns AI message
  const sendMessage = async () => {
    
    if (message === "") return;

    // Reset text field
    setMessage("");

    // Update UI w/ user message & empty AI message
    setMessages((messages) => [
      ...messages,
      {  role: "user", content: message },
      {  role: "assistant", content: "..." },
    ]);

    // Get AI message
    fetch("./api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(
      // Update UI w/ AI message
      async (res) => {

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let result = "";
        
        return reader?.read().then(function processText({ done, value }): any {
          
          // If done, return result
          if (done) return result;
          
          // Decodes the message
          const text = decoder.decode(value || new Int8Array(), { stream: true });
          
          // Update UI w/ all messages (except empty AI message)
          setMessages((messages) => {

            let lastMessage: Message = messages[messages.length - 1];
            let otherMessages: Message[] = messages.slice(0, messages.length - 1);

            if (lastMessage.content === "...") {
              lastMessage.content = "";
            }

            return [
              ...otherMessages,
              {
                role: "assistant",
                content: lastMessage.content + text,
              },
            ];
            
          });

          // Processes the next chunk of the response (recursively)
          return reader.read().then(processText);

        });

      }
    );

  };

  // Sends user message if the enter key is pressed
  const handleEnterKey = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      sendMessage();
    }
  }

  // JSX
  return (
    // <div className="w-screen h-screen flex flex-col justify-center items-center">
    <div className="w-screen min-h-screen">

      {/* Navbar */}
      <div className="flex justify-center items-center h-16 bg-black text-white font-bold text-2xl">
        Headstarter Fitness Assistant
      </div>

      {/* Message window */}
      <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] bg-white">
        <div className="flex flex-col w-[1000px] h-4/5 p-4 m-6 rounded-3xl bg-white border border-solid border-black">
        
          {/* Messages */}
          <div className="flex flex-col-reverse grow overflow-auto max-h-full m-4 scrollbar scrollbar-thumb-blue-500 hover:scrollbar-thumb-blue-700">
            {
              messages.toReversed().map((message: Message, index: number) => {
                return <div key={index} className="flex" style={ getJustifyContent(message.role) }>
                  <div className="text-white rounded-3xl p-6 m-2 max-w-[70%]" style={ getBackgroundColor(message.role) }>
                    {message.content}
                  </div>
                </div>
              })
            }
          </div>

          {/* Text field & button */}
          <div className="flex flex-row m-4">
            <input
              className="w-full px-3 py-3 m-1 rounded-lg border border-[#cccccc] focus:outline focus:outline-2 focus:outline-[#aaaaaa] focus:outline-offset-2 bg-white"
              placeholder="Message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleEnterKey}
            ></input>
            <button className="px-3 py-3 m-1 w-28 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-700 active:outline active:outline-2 active:outline-[#aaaaaa] active:outline-offset-2" onClick={sendMessage}>Send</button>
          </div>

        </div>
      </div>
      
    </div>
  );
}
