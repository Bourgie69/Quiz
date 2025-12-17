import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_TOKEN = process.env.GEMINI_TOKEN;
const ai = new GoogleGenAI({ apiKey: GEMINI_TOKEN });

export const POST = async (request: NextRequest) => {
  try {
    console.log(GEMINI_TOKEN)
    const { prompt } = await request.json();

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });


    return NextResponse.json({ text: response.text }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 400 });
  }
};
