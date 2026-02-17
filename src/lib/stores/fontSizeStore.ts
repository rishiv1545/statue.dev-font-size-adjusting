import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'statue-font-size';
const DEFAULT_SIZE = 1;
const MIN_SIZE = 0.75;
const MAX_SIZE = 1.5;
const STEP = 0.1;

function createFontSizeStore() {
  // Get initial value from localStorage or system preference
  let initialSize = DEFAULT_SIZE;

  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      initialSize = parseFloat(stored);
    } else {
      // Respect browser accessibility settings
      initialSize = 0.9;
    }
  }

  const { subscribe, set, update } = writable<number>(initialSize);

  return {
    subscribe,

    increase: () => update(current => {
      const next = Math.min(current + STEP, MAX_SIZE);
      if (browser) localStorage.setItem(STORAGE_KEY, next.toString());
      return next;
    }),

    decrease: () => update(current => {
      const next = Math.max(current - STEP, MIN_SIZE);
      if (browser) localStorage.setItem(STORAGE_KEY, next.toString());
      return next;
    }),

    reset: () => {
      if (browser) localStorage.removeItem(STORAGE_KEY);
      set(DEFAULT_SIZE);
    }
  };
}

export const fontSize = createFontSizeStore();
