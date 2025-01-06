<script setup lang="ts">
import LabelSizeInputs from "@/components/LabelSizeInputs.vue";
import PreviewCanvas from "@/components/PreviewCanvas.vue";
import { resetLabelSizePreferences, useLabelSize } from "@/composables/useLabelSize";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { TEXT_EDITOR_DEFAULTS as defaults } from "@/const";
import {
  mdiFormatBold,
  mdiFormatHorizontalAlignCenter,
  mdiFormatLetterCaseUpper,
  mdiFormatRotate90,
  mdiRefresh,
} from "@mdi/js";
import { ref } from "vue";

const text = useLocalStorage("editor-text", defaults.text);
const fontSize = useLocalStorage("editor-font-size", defaults.fontSize);
const isBold = useLocalStorage("editor-is-bold", defaults.isBold);
const isUppercase = useLocalStorage("editor-is-uppercase", defaults.isUppercase);
const isVertical = useLocalStorage("editor-is-vertical", defaults.isVertical);
const repeatCount = useLocalStorage("editor-repeat-count", defaults.repeatCount);
const { labelWidth, labelHeight } = useLabelSize();

const previewRef = ref<InstanceType<typeof PreviewCanvas> | null>(null);

const resetPreferences = () => {
  localStorage.clear();
  resetLabelSizePreferences();
  text.value = defaults.text;
  fontSize.value = defaults.fontSize;
  isBold.value = defaults.isBold;
  isUppercase.value = defaults.isUppercase;
  isVertical.value = defaults.isVertical;
  repeatCount.value = defaults.repeatCount;
};

defineExpose({
  getCanvas: () => previewRef.value?.canvas,
});
</script>

<template>
  <v-form @submit.prevent="$emit('print')">
    <h2>Text</h2>

    <v-btn
      :icon="mdiRefresh"
      variant="text"
      class="float-right"
      @click="resetPreferences"
      title="Reset preferences"
    />

    <div class="d-flex align-center mb-2">
      <v-text-field
        v-model.number="fontSize"
        type="number"
        label="Font size (px)"
        min="1"
        density="compact"
        hide-details
        class="me-2"
      />

      <v-text-field
        v-model.number="repeatCount"
        type="number"
        label="Repeat Count"
        min="1"
        density="compact"
        hide-details
        class="me-2"
      />

      <v-btn :class="{ 'bg-grey-lighten-2': isBold }" icon variant="text" @click="isBold = !isBold">
        <v-icon>{{ mdiFormatBold }}</v-icon>
      </v-btn>

      <v-btn
        :class="{ 'bg-grey-lighten-2': isUppercase }"
        icon
        variant="text"
        @click="isUppercase = !isUppercase"
      >
        <v-icon>{{ mdiFormatLetterCaseUpper }}</v-icon>
      </v-btn>

      <v-btn
        :class="{ 'bg-grey-lighten-2': isVertical }"
        icon
        variant="text"
        @click="isVertical = !isVertical"
      >
        <v-icon>{{ isVertical ? mdiFormatRotate90 : mdiFormatHorizontalAlignCenter }}</v-icon>
      </v-btn>
    </div>

    <v-textarea v-model="text" label="Text to print" rows="3" class="mb-2" clearable />

    <label-size-inputs v-model:width="labelWidth" v-model:height="labelHeight" />

    <PreviewCanvas
      ref="previewRef"
      :text="text"
      :font-size="fontSize"
      :is-bold="isBold"
      :is-uppercase="isUppercase"
      :is-vertical="isVertical"
      :repeat-count="repeatCount"
      :label-width="labelWidth"
      :label-height="labelHeight"
      mode="text"
    />

    <v-btn type="submit" color="primary">Connect & print</v-btn>
  </v-form>
</template>
