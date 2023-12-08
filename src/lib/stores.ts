import {writable} from 'svelte/store';
import type {Writable} from 'svelte/store';

export type SelectableModel = 'gpt-4-1106-preview' | 'gpt-3.5-turbo-1106';
export const selectedModel: Writable<SelectableModel> = writable('gpt-3.5-turbo-1106');

export const apiKey: Writable<string> = writable('');
