<template>
  <div class="color-picker-slider">
    <div class="color-picker-slider__title">
      {{ props.title }}
    </div>
    <div class="color-picker-slider__wrapper">
      <div
        ref="canvasElement"
        class="color-picker-slider__canvas"
        @mousedown="onMouseDownCanvas"
      />
      <div
        ref="pointerElement"
        class="color-picker-slider__pointer"
        :style="{
          left: `${props.value * 100}%`,
          backgroundColor: props.pointerColor,
        }"
        :tabIndex="0"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @mousedown="onMouseDown"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'

const clamp = (min: number, value: number, max: number) => Math.min(Math.max(value, min), max);

const canvasElement = ref<HTMLDivElement>()
const pointerElement = ref<HTMLDivElement>()

const isFocused = ref(false)
const isDragged = ref(false)

const props = defineProps({
  value: {
    type: Number,
    required: true
  },

  color: {
    type: Object,
    required: true
  },

  gradient: {
    type: String,
    required: true
  },

  pointerColor: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true
  },
})

const draggedState = { mouseStart: 0, position: props.value }

function onMouseDownCanvas(event: MouseEvent) {
  const offset = event.offsetX;
  const width = canvasElement.value!.clientWidth;
  emit('change', offset / width)

  draggedState.mouseStart = event.clientX - offset
  isDragged.value = true
  setTimeout(() => {
    pointerElement.value!.focus()
  });
}

function onMouseDown(event: MouseEvent) {
  draggedState.mouseStart = event.clientX - draggedState.position
  isDragged.value = true
}

const onMouseMove = (event: MouseEvent) => {
  const width = canvasElement.value!.clientWidth
  const offset = event.clientX - draggedState.mouseStart
  const croppedOffset = clamp(0, offset, width)
  emit('change', croppedOffset / width)
}

const onMouseUp = () => {
  isDragged.value = false
}

const onKeyDown = (e: KeyboardEvent) => {
  const isIncreaseAction = e.code === 'ArrowRight';
  const isDecreaseAction = e.code === 'ArrowLeft';

  if (!(isDecreaseAction || isIncreaseAction)) {
    return;
  }

  let diff = 0.05;
  if (e.altKey) {
    diff = 0.01;
  } else if (e.ctrlKey) {
    diff = 0.2;
  }

  if (isDecreaseAction) {
    diff *= -1;
  }

  emit('change', clamp(0, props.value + diff, 1))
}

watch(
  () => props.value,
  value => {
    draggedState.position = value * canvasElement.value!.offsetWidth;
  }
);

watch(
  () => isFocused.value,
  isDragging => {
    if (isDragging) {
      window.addEventListener('keydown', onKeyDown)
    } else {
      window.removeEventListener('keydown', onKeyDown)
    }
  }
)

watch(
  () => isDragged.value,
  isDragging => {
    if (isDragging) {
      document.body.classList.add('grabbing');
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      document.body.classList.remove('grabbing');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
  }
)

onMounted(() => {
  draggedState.position = props.value * canvasElement.value!.offsetWidth
})

const emit = defineEmits(['change'])
</script>

<style lang="scss" scoped>
.color-picker-slider {
  flex: 1 0 auto;

  &__wrapper {
    height: 20px;
    padding: 5px 0;
    box-sizing: border-box;
    position: relative;
  }

  &__canvas {
    display: block;
    width: 100%;
    height: 100%;
    border: var(--cp-border);
    background: v-bind('props.gradient');
    box-sizing: border-box;
    user-select: none;
  }

  &__pointer {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: -10px;
    box-sizing: border-box;
    border: var(--cp-border);
    background-color: white;
    cursor: grab;
    border-radius: 4px;
    user-select: none;

    &:focus {
      outline: 2px solid rgba(0, 0, 0, 0.7);
    }

    .grabbing & {
      cursor: grabbing;
    }
  }
}
</style>
