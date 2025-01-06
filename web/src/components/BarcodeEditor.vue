<script setup lang="ts">
import { mdiRefresh } from "@mdi/js";
import { ref } from "vue";
import { resetLabelSizePreferences, useLabelSize } from "../composables/useLabelSize";
import { useLocalStorage } from "../composables/useLocalStorage";
import { BARCODE_EDITOR_DEFAULTS as defaults } from "../const";
import LabelSizeInputs from "./LabelSizeInputs.vue";
import PreviewCanvas from "./PreviewCanvas.vue";

const barcodeData = useLocalStorage("barcode-data", defaults.barcodeData);
const { labelWidth, labelHeight } = useLabelSize();

const previewRef = ref<InstanceType<typeof PreviewCanvas> | null>(null);

const resetPreferences = () => {
  barcodeData.value = defaults.barcodeData;
  localStorage.clear();
  resetLabelSizePreferences();
};

defineExpose({
  getCanvas: () => previewRef.value?.canvas,
});
</script>

<template>
  <div>
    <h2>Barcode</h2>

    <v-btn
      :icon="mdiRefresh"
      variant="text"
      class="float-right"
      @click="resetPreferences"
      title="Reset preferences"
    >
      <v-icon>{{ mdiRefresh }}</v-icon>
    </v-btn>

    <v-text-field
      v-model="barcodeData"
      label="Barcode data (CODE128)"
      density="compact"
      class="mb-4"
      clearable
    />

    <label-size-inputs v-model:width="labelWidth" v-model:height="labelHeight" />

    <PreviewCanvas
      ref="previewRef"
      :barcode-data="barcodeData"
      :label-width="labelWidth"
      :label-height="labelHeight"
      mode="barcode"
    />

    <v-btn @click="$emit('print')" color="primary">Connect & print</v-btn>
  </div>
</template>
