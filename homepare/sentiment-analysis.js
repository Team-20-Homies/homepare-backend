const OpenAI = require('openai')
require('dotenv').config()
const axios = require('axios')
const { json } = require('express')
const client = new OpenAI()


async function sentiment_analysis(transcription) {
    response = await client.chat.completions.create({
        model: "gpt-4",
        temperature: 0,
        messages: [
            {
                "role": "system",
                "content": "As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following text. Please consider the overall tone of the discussion, the emotion conveyed by the language used, and the context in which words and phrases are used. Indicate whether the sentiment is generally positive, negative, or neutral, and provide brief explanations for your analysis where possible."
            },
            {
                "role": "user",
                "content": transcription
            }
        ]
    })
    return response['choices'][0]['message']['content']
}


module.exports = sentiment_analysis