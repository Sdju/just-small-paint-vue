<template>
  <ColorPickerSliderBase
    :color="props.color"
    :pointer-color="pointerColor"
    :value="props.color!.saturation"
    title="Saturation"
    :gradient="gradient"
    @change="emit('update:color', { ...props.color, saturation: $event })"
  />
</template>

<script lang="ts" setup>
import ColorPickerSliderBase from './color-picker-slider-base.vue'
import {computed, PropType} from 'vue';
import type {ColorHsl} from '../../types/color';

const props = defineProps({
  color: {
    type: Object as PropType<ColorHsl>,
    required: true
  }
})

const gradient = computed(() => {
  const gradient = []
  gradient.push(`hsl(${props.color.hue}turn,0%,50%)`);
  gradient.push(`hsl(${props.color.hue}turn,100%,50%)`);
  return `linear-gradient(to right, ${gradient.join(',')})`
})
const pointerColor = computed(() => {
  const hue = props.color.hue
  const saturation = props.color.saturation
  return `hsl(${hue}turn,${saturation * 100}%,50%)`
})

const emit = defineEmits(['update:color'])

</script>
