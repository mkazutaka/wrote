<script lang="ts">
  import {debounce} from "$lib";
  import {apiKey, selectedModel} from "$lib/stores";
  import Markdown from 'svelte-exmarkdown';
  import { gfmPlugin } from 'svelte-exmarkdown/gfm';

  let calling_api: boolean = false;
  const plugins = [gfmPlugin()];

  const placeholder = `
こんにちは いい天気 よろしく

1行あけるとLLMに渡される文章がわかれます
//m LLMに指示を与えた結果や会話の回答が出力されます
//h これはそのまま出力されます

例:
//h ## LLMについて紹介

//m 大規模言語モデルについて簡単に説明してください
`

  let inputContents: string = ''
  let outputContents: string = ''
  let inputDivisions: string[] = [];
  let outputDivisions: string[] = [];
  let divisionCaches: Map<string, string> = new Map();

  $: inputDivisions = inputContents.split("\n\n");
  $: outputContents = outputDivisions.join("\n\n");

  const completion = async (index: number, query: string) => {
    console.log('call', query)
    const res = await fetch("/api/completion", {
      method: 'POST',
      body: JSON.stringify({
        apiKey: $apiKey,
        model: $selectedModel,
        query: query,
      }),
    })
    const {answer} = await res.json()
    divisionCaches.set(query, answer)
    outputDivisions[index] = answer
  }

  const handleInput = debounce(async (e: Event & { target: EventTarget & HTMLInputElement }) => {
    if (calling_api) return
    calling_api = true
    const newInputDivisions = e.target.value.split("\n\n");
    let newOutputDivisions: string[] = []
    const promises = []
    for (let [index, newDivision] of newInputDivisions.entries()) {
      const query = newDivision.trim()
      if (query === '') continue
      if (divisionCaches.has(query)) {
        newOutputDivisions.push(divisionCaches.get(query) ?? '')
        continue
      }
      newOutputDivisions.push('...generating')
      promises.push(completion(index, query))
    }
    outputDivisions = newOutputDivisions
    await Promise.all(promises)
    calling_api = false
  }, 1000)
</script>

<div class="h-full w-full flex flex-row justify-center items-center bg-gray-200">
    <div class="h-full w-full bg-gray-200">
        <textarea
                class="h-full w-full p-2"
                on:input={handleInput}
                placeholder={placeholder}
        />
    </div>

    <div class="h-full w-full markdown p-2 overflow-y-auto prose break-words">
        <Markdown md={outputContents} {plugins} />
    </div>
</div>
