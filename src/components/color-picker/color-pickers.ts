import {h, defineComponent, PropType, computed} from 'vue';
import {ColorHsl} from '../../types/color';
import ColorPickerSliderBase from './color-picker-slider-base.vue';

export const ColorPickerSliderHue = defineComponent({
  name: 'ColorPickerSliderHue',
  emits: ['update:color'],
  props: {
    color: {
      type: Object as PropType<ColorHsl>,
      required: true
    }
  },
  
  setup(props, context) {
    const gradient = computed(() => {
      const gradient = []
      for (let i = 0; i <= 1; i += 1 / 6) {
        gradient.push(`hsl(${i}turn,100%,50%) ${i * 100}%`);
      }
      return 'linear-gradient(to right, ' + gradient.join(',')  + ')'
    })
    
    const pointerColor = computed(() => {
      const hue = props.color.hue
      return `hsl(${hue}turn,100%,50%)`
    })
    
    return () => {
      return h(ColorPickerSliderBase, {
        color: props.color,
        pointerColor: pointerColor.value,
        value: props.color.hue,
        title: 'Hue',
        gradient: gradient.value,
        onChange: (event: number)=> {
          context.emit('update:color', { ...props.color, hue: event })
        }
      })
    }
  }
})


export const ColorPickerSliderSaturation = defineComponent({
  name: 'ColorPickerSliderSaturation',
  emits: ['update:color'],
  props: {
    color: {
      type: Object as PropType<ColorHsl>,
      required: true
    }
  },

  setup(props, context) {
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

    return () => {
      return h(ColorPickerSliderBase, {
        color: props.color,
        pointerColor: pointerColor.value,
        value: props.color.saturation,
        title: 'Saturation',
        gradient: gradient.value,
        onChange: (event: number)=> {
          context.emit('update:color', { ...props.color, saturation: event })
        }
      })
    }
  }
})

export const ColorPickerSliderLightness = defineComponent({
  name: 'ColorPickerSliderLightness',
  emits: ['update:color'],
  props: {
    color: {
      type: Object as PropType<ColorHsl>,
      required: true
    }
  },

  setup(props, context) {
    const gradient = computed(() => {
      const gradient = []
      const hue = props.color.hue
      const saturation = props.color.saturation
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,0%)`)
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,50%)`)
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,100%)`)

      return `linear-gradient(to right, ${gradient.join(',')})`
    })

    const pointerColor = computed(() => {
      const hue = props.color.hue
      const saturation = props.color.saturation
      const lightness = props.color.lightness
      return `hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%)`
    })

    return () => {
      return h(ColorPickerSliderBase, {
        color: props.color,
        pointerColor: pointerColor.value,
        value: props.color.lightness,
        title: 'Lightness',
        gradient: gradient.value,
        onChange: (event: number)=> {
          context.emit('update:color', { ...props.color, lightness: event })
        }
      })
    }
  }
})


export const ColorPickerSliderAlpha = defineComponent({
  name: 'ColorPickerSliderAlpha',
  emits: ['update:color'],
  props: {
    color: {
      type: Object as PropType<ColorHsl>,
      required: true
    }
  },
  
  setup(props, context) {
    const gradient = computed(() => {
      const gradient = []
      const hue = props.color.hue
      const saturation = props.color.saturation
      const lightness = props.color.lightness
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%,0)`)
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%,1)`)

      return `linear-gradient(to right, ${gradient.join(',')})`
    })

    const pointerColor = computed(() => {
      const hue = props.color.hue
      const saturation = props.color.saturation
      const lightness = props.color.lightness
      const alpha = props.color.alpha ?? 1
      return `hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%,${alpha})`
    })

    return () => {
      return h(ColorPickerSliderBase, {
        color: props.color,
        pointerColor: pointerColor.value,
        value: props.color?.alpha || 1,
        title: 'Alpha',
        gradient: gradient.value,
        onChange: (event: number)=> {
          context.emit('update:color', { ...props.color, alpha: event })
        }
      })
    }
  }
})
