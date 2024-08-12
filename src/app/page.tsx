"use client";

// Imports
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

// Helper functions
function getJustifyContent(messageRole: string): Style {
  const flexType: string = (messageRole === "assistant") ? "start" : "end";
  return { justifyContent: `flex-${flexType}` };
}

function getBackgroundColor(messageRole: string): Style {
  const bgColorType: string = (messageRole === "assistant") ? "#2196f3" : "#f44336";
  return { backgroundColor: bgColorType };
}

// Main component to export
export default function Home(): JSX.Element {

  const [ messages, setMessages ]: [ Message[], Dispatch<SetStateAction<Message[]>> ] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the Headstarter fitness assistant. How can I help you today?"
    }
  ]);
  const [ message, setMessage ] = useState("");

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col w-[600px] h-[700px] border border-solid border-black p-4 m-6">
        
        {/* Messages */}
        <div className="flex flex-col grow overflow-auto max-h-full m-4">
          {
            messages.map((message: Message, index: number) => {
              return <div key={index} className="flex" style={ getJustifyContent(message.role) }>
                  <div className="text-white rounded-2xl p-6" style={ getBackgroundColor(message.role) }>
                    {message.content}
                  </div>
              </div>
            })
          }
        </div>

        {/* TODO: Text field */}
        <div></div>

      </div>
    </div>
  );
}
