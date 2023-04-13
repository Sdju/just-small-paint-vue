<template>
  <ColorPickerSliderBase
    :color="props.color"
    :pointer-color="pointerColor"
    :value="props.color!.lightness"
    title="Lightness"
    :gradient="gradient"
    @change="emit('update:color', { ...props.color, lightness: $event })"
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
  const hue = props.color.hue
  const saturation = props.color.saturation
  gradient.push(`hsl(${hue}turn,${saturation * 100}%,0%)`);
  gradient.push(`hsl(${hue}turn,${saturation * 100}%,50%)`);
  gradient.push(`hsl(${hue}turn,${saturation * 100}%,100%)`);
  return `linear-gradient(to right, ${gradient.join(',')})`
})

const pointerColor = computed(() => {
  const hue = props.color.hue
  const saturation = props.color.saturation
  const lightness = props.color.lightness
  return `hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%)`
})

const emit = defineEmits(['update:color'])

</script>
