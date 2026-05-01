import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "API Key belum diatur. Tolong tambahkan GEMINI_API_KEY di file .env.local Anda ya! 😊" },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "Kamu adalah AiCino, Asisten Barista cerdas untuk aplikasi E-Coffee Keliling. Kamu ramah, sopan, dan ahli dalam merekomendasikan kopi. Kamu menyapa dengan ceria dan sesekali menggunakan emoji yang relevan. Jika ditanya selain kopi atau E-Coffee Keliling, coba arahkan kembali pembicaraan ke kopi dengan sopan."
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
      { message: "Maaf, sepertinya mesin espresso saya sedang gangguan (Error). Tolong coba lagi nanti!" },
      { status: 500 }
    );
  }
}
