// UI-only in-memory state helper. Data resets when the page reloads.
const memoryStore = new Map();

export const load = (key, fallback) => {
  if (!memoryStore.has(key)) return fallback;
  return memoryStore.get(key);
};

export const save = (key, value) => {
  memoryStore.set(key, value);
};

export const uid = (prefix) => `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
