<script setup lang="ts">
import { drawText } from "canvas-txt";
import JsBarcode from "jsbarcode";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  mode?: "text" | "barcode";
  text?: string;
  fontSize?: number;
  isBold?: boolean;
  isUppercase?: boolean;
  isVertical?: boolean;
  repeatCount?: number;
  barcodeData?: string;
  labelWidth: number;
  labelHeight: number;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);

const updateCanvasSize = () => {
  if (!canvas.value) return;

  // Image sent to printer is printed top to bottom, so reverse width and height
  canvas.value.width = props.labelHeight * 8;
  canvas.value.height = props.labelWidth * 8;
};

const updateCanvasText = () => {
  if (!canvas.value || props.mode !== "text") return;

  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

  ctx.save();
  ctx.translate(canvas.value.width / 2, canvas.value.height / 2);
  ctx.rotate(props.isVertical ? Math.PI / 2 : 0);

  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let processedText = props.text || "";
  if (props.isUppercase) {
    processedText = processedText.toUpperCase();
  }
  if (props.repeatCount && props.repeatCount > 1 && !processedText.endsWith("\n")) {
    processedText = processedText + "\n";
  }
  const repeatedText = processedText.repeat(props.repeatCount || 1).replace(/\n$/, "");

  const textWidth = props.isVertical ? canvas.value.height : canvas.value.width;
  const textHeight = props.isVertical ? canvas.value.width : canvas.value.height;

  drawText(ctx, repeatedText, {
    x: -textWidth / 2,
    y: -textHeight / 2,
    width: textWidth,
    height: textHeight,
    font: "sans-serif",
    fontSize: props.fontSize,
    fontWeight: props.isBold ? "700" : "400",
    align: "center",
    vAlign: "middle",
  });

  ctx.restore();
};

const updateCanvasBarcode = () => {
  if (!canvas.value || props.mode !== "barcode" || !props.barcodeData) return;

  const image = document.createElement("img");
  image.addEventListener("load", () => {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

    ctx.translate(canvas.value.width / 2, canvas.value.height / 2);
    ctx.rotate(Math.PI / 2);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    ctx.rotate(-Math.PI / 2);
    ctx.translate(-canvas.value.width / 2, -canvas.value.height / 2);
  });

  JsBarcode(image, props.barcodeData, {
    format: "CODE128",
    width: 2,
    height: props.labelHeight * 7,
    displayValue: false,
  });
};

const reloadCanvas = () => {
  updateCanvasSize();
  if (props.mode === "text") {
    updateCanvasText();
  } else {
    updateCanvasBarcode();
  }
};

watch(() => [props.labelWidth, props.labelHeight], reloadCanvas, { immediate: true });
watch(
  () => [
    props.text,
    props.fontSize,
    props.isBold,
    props.isUppercase,
    props.isVertical,
    props.repeatCount,
  ],
  updateCanvasText
);
watch(() => props.barcodeData, updateCanvasBarcode);

onMounted(() => {
  reloadCanvas();
});

defineExpose({ canvas });
</script>
<template>
  <div>
    <h2>Preview</h2>
    <p>Images are sent to printer vertically.</p>

    <v-card class="mb-4" color="grey-darken-4">
      <v-card-text class="pa-1 d-flex justify-center">
        <canvas ref="canvas"></canvas>
      </v-card-text>
    </v-card>
  </div>
</template>
