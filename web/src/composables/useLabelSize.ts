import type { Ref } from "vue";
import { LABEL_SIZE_DEFAULTS } from "../const";
import { useLocalStorage } from "./useLocalStorage";

let labelWidth: Ref<number>;
let labelHeight: Ref<number>;

export const resetLabelSizePreferences = () => {
  labelWidth.value = LABEL_SIZE_DEFAULTS.width;
  labelHeight.value = LABEL_SIZE_DEFAULTS.height;
};

export function useLabelSize() {
  // Initialize only once
  if (!labelWidth || !labelHeight) {
    labelWidth = useLocalStorage("label-width", LABEL_SIZE_DEFAULTS.width);
    labelHeight = useLocalStorage("label-height", LABEL_SIZE_DEFAULTS.height);
  }

  return {
    labelWidth,
    labelHeight,
  };
}
