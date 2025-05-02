/*
Run this model in Javascript

> npm install openai
*/

import OpenAI from "openai";

// To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings. 
// Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = process.env["GITHUB_TOKEN"];

export async function main(lyrics, targetLanguage) {

  const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token
  });

  // Construct the message to translate the lyrics
  const message = `Translate the following lyrics to ${targetLanguage}: \n${lyrics}`;

  // Call the OpenAI API with the lyrics and target language
  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "" },
      { role: "user", content: message }
    ],
    model: "openai/gpt-4o-mini",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1
  });

  // Output the translated lyrics
  console.log("Translated Lyrics:", response.choices[0].message.content);
}

// Example usage: 
// Replace with actual lyrics and target language
const lyrics = "I'm walking on sunshine, whoa, and don't it feel good?";
const targetLanguage = "Spanish";

main(lyrics, targetLanguage).catch((err) => {
  console.error("The sample encountered an error:", err);
});
