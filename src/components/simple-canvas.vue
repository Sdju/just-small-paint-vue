<template>
  <div class="simple-canvas">
    <ColorPickerSliderHue v-model:color="color" />
    <ColorPickerSliderSaturation v-model:color="color" />
    <ColorPickerSliderLightness v-model:color="color" />
    <canvas
      class="simple-canvas__canvas"
      ref="canvas"
      v-on="canvasHandlers"
    />
    <button @click="onButtonClear">
      Clear
    </button>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watchEffect} from 'vue'
import ColorPickerSliderHue from './color-picker/color-picker-slider-hue.vue';
import ColorPickerSliderSaturation from './color-picker/color-picker-slider-saturation.vue';
import ColorPickerSliderLightness from './color-picker/color-picker-slider-lightness.vue';

const canvas = ref<HTMLCanvasElement>()
const ctxRef = ref<null | CanvasRenderingContext2D>(null)
const isPainting = ref(false)
const color = ref({hue: 0, saturation: 1, lightness: 0.5})

const canvasHandlers = computed(() => {
  if (!isPainting.value) {
    return {
      mousedown: onMouseDown,
    }
  }

  return {
    mousemove: onMouseMove,
    mouseleave: onMouseLeave,
    mouseup: onMouseUp,
  }
})

onMounted(() => {
  const canvasEl = (canvas.value as HTMLCanvasElement)
  canvasEl.width = canvasEl.clientWidth
  canvasEl.height = canvasEl.clientHeight
  ctxRef.value = canvasEl.getContext('2d')
})

function onMouseDown(event: MouseEvent) {
  isPainting.value = true

  const ctx = (ctxRef.value as CanvasRenderingContext2D)
  ctx.moveTo(event.offsetX, event.offsetY)
  ctx.beginPath()
}

function onMouseUp() {
  isPainting.value = false
}

function onMouseLeave() {
  isPainting.value = false
}

function onMouseMove(event: MouseEvent) {
  if (!isPainting.value) {
    return
  }

  const ctx = (ctxRef.value as CanvasRenderingContext2D)
  ctx.strokeStyle = `hsl(${color.value.hue * 360}, ${color.value.saturation * 100}%, ${color.value.lightness * 100}%)`
  console.log(`hsl(${360 * color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%)`)
  ctx.lineTo(event.offsetX, event.offsetY)
  ctx.stroke();
  console.log(`line: ${event.offsetX}, ${event.offsetY}`)
}

function onButtonClear() {
  const ctx = (ctxRef.value as CanvasRenderingContext2D)
  const canvasEl = (canvas.value as HTMLCanvasElement)
  ctx.clearRect(0, 0, canvasEl.clientWidth, canvasEl.clientHeight)
}

watchEffect(() => {
  console.log('isPainting: ', isPainting.value)
})

</script>

<style lang="scss" scoped>
.simple-canvas {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__canvas {
    width: 500px;
    height: 300px;
    background-color: white;
    cursor: crosshair;
    user-select: none;
  }
}
</style>
