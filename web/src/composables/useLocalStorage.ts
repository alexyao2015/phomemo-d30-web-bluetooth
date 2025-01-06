import type { Ref } from "vue";
import { ref, watch } from "vue";

export function useLocalStorage<T extends string | number | boolean | null | undefined | object>(
  key: string,
  defaultValue: T
): Ref<T> {
  const stored = localStorage.getItem(key);
  const value = ref(stored ? JSON.parse(stored) : defaultValue) as Ref<T>;

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });

  return value;
}
