const OpenAI = require('openai')
const apikey = process.env.OPENAI_API_KEY
// const apikey = "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"
const axios = require('axios')
const client = axios.create({
    headers: { 'Authorization': `Bearer ${apikey}` }
})



let transcription = "This pad thai is really good"


function sentiment_analysis(transcription) {
    response = client.chat.completions.create(
        model = "gpt-4",
        temperature = 0,
        messages = [
            {
                "role": "system",
                "content": "As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following text. Please consider the overall tone of the discussion, the emotion conveyed by the language used, and the context in which words and phrases are used. Indicate whether the sentiment is generally positive, negative, or neutral, and provide brief explanations for your analysis where possible."
            },
            {
                "role": "user",
                "content": transcription
            }
        ]
    )
    return response['choices'][0]['message']['content']
}

sentiment_analysis(transcription);