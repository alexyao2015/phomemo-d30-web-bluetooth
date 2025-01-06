<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useTheme } from "vuetify";
import { printCanvas } from "./printer";

const TextEditor = defineAsyncComponent(() => import("./components/TextEditor.vue"));
const BarcodeEditor = defineAsyncComponent(() => import("./components/BarcodeEditor.vue"));

const theme = useTheme();

const updateTheme = (isDark: boolean) => {
  theme.global.name.value = isDark ? "dark" : "light";
};

onMounted(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  updateTheme(mediaQuery.matches);

  mediaQuery.addEventListener("change", (e) => updateTheme(e.matches));
});

const activeTab = ref("text");
const textEditorRef = ref<InstanceType<typeof TextEditor> | null>(null);
const barcodeEditorRef = ref<InstanceType<typeof BarcodeEditor> | null>(null);

const showError = ref(false);
const errorMessage = ref("");

const handleError = (err: Error | string) => {
  console.error(err);
  errorMessage.value = err.toString();
  showError.value = true;
};

const handlePrint = async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["0000ff00-0000-1000-8000-00805f9b34fb"],
    });
    const server = await device.gatt?.connect();
    if (!server) throw new Error("Failed to connect");

    const service = await server.getPrimaryService("0000ff00-0000-1000-8000-00805f9b34fb");
    const char = await service.getCharacteristic("0000ff02-0000-1000-8000-00805f9b34fb");

    const canvas =
      activeTab.value === "text"
        ? textEditorRef.value?.getCanvas()
        : barcodeEditorRef.value?.getCanvas();

    if (!canvas) throw new Error("Canvas not found");

    await printCanvas(char, canvas);
  } catch (err) {
    handleError(err as Error);
  }
};
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>Phomemo D30 Web Bluetooth</h1>

        <v-tabs v-model="activeTab">
          <v-tab value="text">Text</v-tab>
          <v-tab value="barcode">Barcode</v-tab>
        </v-tabs>

        <v-window v-model="activeTab" class="mt-4">
          <v-window-item value="text">
            <Suspense>
              <template #default>
                <text-editor ref="textEditorRef" @print="handlePrint" />
              </template>
              <template #fallback>
                <v-skeleton-loader type="article" />
              </template>
            </Suspense>
          </v-window-item>

          <v-window-item value="barcode">
            <Suspense>
              <template #default>
                <barcode-editor ref="barcodeEditorRef" @print="handlePrint" />
              </template>
              <template #fallback>
                <v-skeleton-loader type="article" />
              </template>
            </Suspense>
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>

    <v-snackbar v-model="showError" color="error">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
