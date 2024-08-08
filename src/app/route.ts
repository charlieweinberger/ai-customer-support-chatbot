import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import Groq from "groq-sdk";

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt: string = "System prompt for the AI, providing guidelines on how to respond to users. End every sentence with 'Adios!'"; // Use your own system prompt here

// POST function to handle incoming requests
export async function POST(request: Request): Promise<NextResponse<unknown>> {
  
  const groq: Groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });
  const data: any = await request.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API

  const completion = await groq.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...data ],
    model: "llama3-8b-8192",
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream: ReadableStream<any> = new ReadableStream({
    async start(controller) {
      const encoder: TextEncoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content: string | null | undefined = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text: Uint8Array = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response

}