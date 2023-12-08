<script lang="ts">
  import "../app.css";
  import {apiKey, selectedModel} from "$lib/stores";
  import type {SelectableModel} from "$lib/stores";
  import HelpCircle from 'svelte-material-icons/HelpCircleOutline.svelte';

  function handleChangeModel(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
    const model = e.currentTarget.value as SelectableModel
    selectedModel.set(model);
  }

  function handleChangeKey(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const key = e.currentTarget.value
    apiKey.set(key);
  }

  function openHelpModal() {
    const modal = document.getElementById('help_modal') as HTMLDialogElement;
    modal.showModal();
  }
</script>

<div class="h-screen w-full flex flex-col justify-center items-center bg-gray-200">
    <div class="w-full h-11 bg-black px-2 flex items-center justify-between">
        <select on:change={handleChangeModel} class="select select-bordered select-sm">
            <option value="gpt-3.5-turbo-1106">GPT-3.5-Turbo</option>
            <option value="gpt-4-1106-preview">GPT-4-Turbo</option>
        </select>
        <div class="flex items-center gap-2">
            <input type="password" class="input input-bordered input-sm ml-2" placeholder="OPENAI API KEY"
                   on:keyup={handleChangeKey} on:change={handleChangeKey}/>
            <button on:click={openHelpModal}>
                <HelpCircle size={24} class="text-white" />
            </button>
        </div>
    </div>
    <slot/>
</div>

<dialog id="help_modal" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg pb-2">wroteについて説明</h3>
        <p>wroteは、入力した単語をLLMを使って文章にするエディターです</p>
        <p>いくつかの特殊コマンドを搭載しています</p>

        <h3 class="font-bold text-lg pt-4 pb-2">特殊コマンド</h3>
        <p>\\m [テキスト]: テキストをLLMに渡しその結果が出力されます</p>
        <p>\\h [テキスト]: テキストがそのまま出力されます</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>
