import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const titleContext = body.prompt ? ` Make the questions related to this topic/title: "${body.prompt}".` : "";
    const prompt =
      `Create a list of three open-ended and engaging questions formatted as a single string. Each question MUST be separated by '||'. DO NOT include any other text, markdown, or bullet points. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics.${titleContext} For example, your output must look exactly like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const result = streamText({
      model: google(modelName),
      maxOutputTokens: 400,
      system: "You are an API that ONLY outputs exactly three questions separated by '||'. NO markdown, NO bullet points, NO extra text. Example format: 'Question 1?||Question 2?||Question 3?'",
      prompt: prompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("An unexpected error occurred in suggest-messages:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
}
