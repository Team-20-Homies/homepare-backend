// import OpenAI from "openai";
const OpenAI = require('openai')
const apikey = process.env.OPENAI_API_KEY
const axios = require('axios')
const client = axios.create({
    headers: { 'Authorization': 'Bearer ' + apikey }
})
const params = {
    "prompt": "Once upon a time",
    "max_tokens": 10
}

client.post('https://api.openai.com/v1/engines/davinci/completions', params)
    .then((result) => {
        console.log(params.prompt + result.data.choices[0].text);
    }).catch((err) => {
        console.log(err)
    });

// const openai = new OpenAI({
//     // apikey: process.env.OPENAI_API_KEY
// });

// async function main() {
//     const completion = await openai.chat.completions.create({
//         messages: [{
//             role: "system",
//             content: "You are a helpful assistant."
//         }],
//         model: "gpt-3.5-turbo"
//     });
//     console.log(completion.choices[0]);
// }

// main();




// var transcription = "This pad thai is really good"


// function sentiment_analysis(transcription) {
//     response = client.chat.completions.create(
//         model = "gpt-4",
//         temperature = 0,
//         messages = [
//             {
//                 "role": "system",
//                 "content": "As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following text. Please consider the overall tone of the discussion, the emotion conveyed by the language used, and the context in which words and phrases are used. Indicate whether the sentiment is generally positive, negative, or neutral, and provide brief explanations for your analysis where possible."
//             },
//             {
//                 "role": "user",
//                 "content": transcription
//             }
//         ]
//     )
//     return response['choices'][0]['message']['content']
// }
