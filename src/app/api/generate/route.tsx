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

    let responseText = "";
    if (response.text) {
      responseText = response.text;
    } else if (
      response.candidates &&
      response.candidates[0].content?.parts?.[0].text
    ) {
      responseText = response.candidates[0].content.parts[0].text;
    } else {
      responseText = JSON.stringify(response);
    }

    return NextResponse.json({ text: responseText }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 400 });
  }
};
