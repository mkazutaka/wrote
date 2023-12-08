import {json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import OpenAI from 'openai';

type Model = 'gpt-4-1106-preview' | 'gpt-3.5-turbo-1106'

export const POST: RequestHandler = async ({request}) => {
  const {query, apiKey, model} = await request.json();

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  let answer = ""
  if (query.startsWith("//m ")) {
    answer = await toChat(openai, model, query.slice(4));
  } else if (query.startsWith("//h ")) {
    answer = query.slice(4);
  } else {
    answer = await toSentence(openai, model, query);
  }

  return json({
    answer: answer,
  });
};


async function toChat(openai: OpenAI, model: string, query: string): Promise<string> {
  if (query === "") return ""

  const system_prompt = `
あなたは、優秀なアシスタントです。
ユーザの質問や指示に応えることができます。
結果は、JSON形式で出力することができます。
JSONは、{ "result": str }の形式で出力します。
`

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'user', content: query }
    ],
    temperature: 0,
    model: model,
  }, {
    timeout: 60 * 1000,
  });

  if (!completion.choices[0].message.content) return ""
  try {
    return JSON.parse(completion.choices[0].message.content).result
  } catch (error) {
    return completion.choices[0].message.content
  }
}


async function toSentence(openai: OpenAI, model: Model, query: string): Promise<string> {

  let system_prompt = ""
  if (model === "gpt-4-1106-preview") {
    system_prompt = `
あなたは、入力された単語や言葉を元に文章を作成できる優秀なアシスタントです。
ユーザは、あなたに与えた単語を記事やブログ向けの文章にすることを望んでいます。
文章は、JSON形式で出力することができます。
JSONは、{ "result": str }の形式で出力します。
`}
  if (model === "gpt-3.5-turbo-1106") {
    system_prompt = `
あなたは、入力された単語や言葉を元に文章を作成できる優秀なアシスタントです。
ユーザは、あなたに与えた単語を記事やブログ向けの文章にすることを望んでいます。
場合によって補足してください。
文章は、JSON形式で出力することができます。
JSONは、{ "result": str }の形式で出力します。
`
  }
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'user', content: '以下の文章を変換してください\n ```\n' + query + '\n```' }
    ],
    model: model,
    temperature: 0,
    response_format: {
      type: "json_object"
    }
  }, {
    timeout: 60 * 1000,
  });
  if (completion.choices[0].message.content) {
    return JSON.parse(completion.choices[0].message.content).result
  }
  return ""
}
