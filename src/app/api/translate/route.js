// app/api/translate/route.js

import OpenAI from "openai"

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference", // <-- Your custom base URL
  apiKey: process.env.GITHUB_TOKEN,              // <-- Use your GitHub token or switch to OPENAI_API_KEY if using OpenAI
})

export async function POST(req) {
  try {
    const { lyrics, language } = await req.json()

    const message = `Translate the following text to ${language}, dont return anything else: \n\n${lyrics}`

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "" },
        { role: "user", content: message },
      ],
      model: "openai/gpt-4o-mini",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    })

    const translatedLyrics = response.choices?.[0]?.message?.content || "No translation found."
    return Response.json({ translatedLyrics })
  } catch (error) {
    console.error("Translation error:", error)
    return new Response("Error translating lyrics", { status: 500 })
  }
}
