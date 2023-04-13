<template>
  <ColorPickerSliderBase
    :color="props.color"
    :pointer-color="`hsl(${props.color!.hue}turn,100%,50%)`"
    :value="props.color!.hue"
    title="Hue"
    :gradient="gradient"
    @change="emit('update:color', { ...props.color, hue: $event })"
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
  for (let i = 0; i <= 1; i += 1 / 6) {
    gradient.push(`hsl(${i}turn,100%,50%) ${i * 100}%`);
  }
  return 'linear-gradient(to right, ' + gradient.join(',')  + ')'
})

const emit = defineEmits(['update:color'])

</script>
