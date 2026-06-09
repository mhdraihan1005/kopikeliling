import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "API Key is not configured. Please add GEMINI_API_KEY to your .env file! 😊" },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are AiCino, the smart Barista Assistant for the KopiKuy application. You are friendly, polite, and an expert in recommending coffee. You greet users cheerfully and occasionally use relevant emojis. If asked about something other than coffee or KopiKuy, politely redirect the conversation back to coffee."
    });
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Gemini API requires the history to start with a 'user' message.
    if (history.length > 0 && history[0].role === "model") {
      history = history.slice(1);
    }

    const currentMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(currentMessage);
    const responseText = result.response.text();

    return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { message: "Sorry, it seems my espresso machine is having trouble (Error). Please try again later!" },
      { status: 500 }
    );
  }
}
