import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const titleContext = body.prompt ? ` Make the messages related to this topic/title: "${body.prompt}".` : "";
    const prompt =
      `Create a list of exactly three engaging, friendly, or intriguing anonymous messages (not questions) formatted as a single string. Each message MUST be separated by '||'. DO NOT include any other text, markdown, or bullet points. These messages are for an anonymous social messaging platform, like NGL or Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics.${titleContext} For example, your output must look exactly like this: 'You have a really great vibe!||I loved what you said the other day.||Keep being awesome!'`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const result = streamText({
      model: google(modelName),
      maxOutputTokens: 400,
      system: "You are an API that ONLY outputs exactly three short messages separated by '||'. NO markdown, NO bullet points, NO extra text. Example format: 'Message 1||Message 2||Message 3'",
      prompt: prompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("An unexpected error occurred in suggest-messages:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
}
