import type { Actions } from './$types';
import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: 'My API Key', // defaults to process.env["OPENAI_API_KEY"]
// });

export const actions = {
  default: async(event) => {
    console.log('a')
    return "aaaaaaaaa"
    // return {
    //   "result": "aaaaaaaa"
    // }

    // const chatCompletion = await openai.chat.completions.create({
    //   messages: [{
    //     role: 'user', content: 'Say this is a test'
    //   }],
    //   model: 'gpt-3.5-turbo',
    // });
    // return chatCompletion
  }
} satisfies Actions;
