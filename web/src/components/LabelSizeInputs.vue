<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  width: number;
  height: number;
}>();

const emit = defineEmits<{
  "update:width": [value: number];
  "update:height": [value: number];
}>();

const widthModel = computed({
  get: () => props.width,
  set: (value) => emit("update:width", value),
});

const heightModel = computed({
  get: () => props.height,
  set: (value) => emit("update:height", value),
});
</script>

<template>
  <div>
    <h2>Label size</h2>
    <div class="d-flex gap-2 mb-4">
      <v-text-field
        v-model.number="widthModel"
        type="number"
        label="Width (mm)"
        min="1"
        density="compact"
        class="me-2"
      />
      <v-text-field
        v-model.number="heightModel"
        type="number"
        label="Height (mm)"
        min="1"
        density="compact"
      />
    </div>
  </div>
</template>
