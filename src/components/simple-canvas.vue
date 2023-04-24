<template>
  <div class="simple-canvas">
    <div class="simple-canvas__tool-bar">
      <ColorPickerSliderHue v-model:color="color" />
      <ColorPickerSliderSaturation v-model:color="color" />
      <ColorPickerSliderLightness v-model:color="color" />
      <ColorPickerSliderAlpha v-model:color="color" />
      <button class="simple-canvas__button" @click="onButtonClear">
        Clear
      </button>
    </div>
    <div class="simple-canvas__canvas-wrapper">
      <canvas
        key="canvas"
        class="simple-canvas__canvas"
        :width="width"
        :height="height"
        ref="canvas"
        v-on="canvasHandlers"
      />
      <div
        v-if="isResizing"
        :style="{
          width: width + resizingCache.diffX + 'px',
          height: height + resizingCache.diffY + 'px'
        }"
        class="simple-canvas__resize-preview"
      />
      <button 
        class="simple-canvas__resizer simple-canvas__resizer--width"
        @mousedown="onResizerMouseDown($event, 'width')"
      />
      <button 
        class="simple-canvas__resizer simple-canvas__resizer--height"
        @mousedown="onResizerMouseDown($event, 'height')"
      />
      <button 
        class="simple-canvas__resizer"
        @mousedown="onResizerMouseDown($event, 'both')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, reactive, ref, watch, watchEffect} from 'vue'
import { ColorPickerSliderLightness, ColorPickerSliderSaturation, ColorPickerSliderHue, ColorPickerSliderAlpha } from './color-picker/color-pickers'

const CAN_CHANGE_WIDTH = 0b01
const CAN_CHANGE_HEIGHT = 0b10

const canvas = ref<HTMLCanvasElement>()
const ctxRef = ref<null | CanvasRenderingContext2D>(null)
const isPainting = ref(false)
const color = ref({hue: 0, saturation: 1, lightness: 0.5})
const width = ref(500)
const height = ref(300)

const isResizing = ref(false)
const resizingCache = reactive({x: 0, y: 0, diffX: 0, diffY: 0, type: 0})

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

watch(() => isResizing.value, value => {
  if (value) {
    window.addEventListener('mousemove', onResizerMouseMove)
    window.addEventListener('mouseup', onResizerMouseUp)
    window.addEventListener('mouseleave', onResizerMouseLeave)
  } else {
    window.removeEventListener('mousemove', onResizerMouseMove)
    window.removeEventListener('mouseup', onResizerMouseUp)
    window.removeEventListener('mouseleave', onResizerMouseLeave)
  }
})

function resizeCanvas(newWidth: number, newHeight: number) {
  width.value = newWidth
  height.value = newHeight

  const tmpCanvas = document.createElement('canvas')
  const tmpCtx = tmpCanvas.getContext('2d') as CanvasRenderingContext2D
  tmpCanvas.width = newWidth
  tmpCanvas.height = newHeight
  tmpCtx.drawImage(canvas.value as HTMLCanvasElement, 0, 0)

  nextTick(() => {
    ctxRef.value!.drawImage(tmpCanvas, 0, 0)
  })
}

function onResizerMouseDown(event: MouseEvent, type: 'both' | 'height' | 'width') {
  const typeMap = {
    both: CAN_CHANGE_WIDTH | CAN_CHANGE_HEIGHT,
    width: CAN_CHANGE_WIDTH,
    height: CAN_CHANGE_HEIGHT
  }
  
  isResizing.value = true
  resizingCache.x = event.clientX
  resizingCache.y = event.clientY
  resizingCache.diffX = 0
  resizingCache.diffY = 0
  resizingCache.type = typeMap[type]
}

function onResizerMouseMove(event: MouseEvent) {
  if (resizingCache.type & CAN_CHANGE_WIDTH) {
    resizingCache.diffX = event.clientX - resizingCache.x
  }
  if (resizingCache.type & CAN_CHANGE_HEIGHT) {
    resizingCache.diffY = event.clientY - resizingCache.y
  }
}

function onResizerMouseUp() {
  isResizing.value = false

  resizeCanvas(
    width.value + resizingCache.diffX,
    height.value + resizingCache.diffY
  )
}

function onResizerMouseLeave() {
  isResizing.value = false
}

</script>

<style lang="scss" scoped>
.simple-canvas {
  display: flex;
  flex-direction: row;
  gap: 16px;

  &__canvas {
    background-color: white;
    cursor: crosshair;
    user-select: none;
  }

  &__tool-bar {
    width: 260px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 8px;
    border-right: 1px solid black;
    padding-right: 16px;
  }
  
  &__button {
  }
  
  &__canvas-wrapper {
    position: relative;
    height: fit-content;
    width: fit-content;
  }
  
  &__resizer {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    transform: translate(100%, 100%);
    cursor: nwse-resize;
    background: none;
    outline: 0;
    border: 0;
    
    &:before {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      top: -3px;
      left: 1px;
      background: white;
    }
    
    &--width {
      bottom: 50%;
      cursor: ew-resize;
    }
    
    &--height {
      right: 50%;
      cursor: ns-resize;
    }
  }
  
  &__resize-preview {
    position: absolute;
    pointer-events: none;
    border: 1px black dotted;
    left: 0;
    top: 0;
  }
}
</style>
