import {h, defineComponent, PropType} from 'vue';
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
  
  computed: {
    gradient() {
      const gradient = []
      for (let i = 0; i <= 1; i += 1 / 6) {
        gradient.push(`hsl(${i}turn,100%,50%) ${i * 100}%`);
      }
      return 'linear-gradient(to right, ' + gradient.join(',')  + ')'
    },

    pointerColor() {
      const hue = this.color.hue
      return `hsl(${hue}turn,100%,50%)`
    }
  },
  
  render() {
    return h(ColorPickerSliderBase, {
      color: this.color,
      pointerColor: this.pointerColor,
      value: this.color.hue,
      title: 'Hue',
      gradient: this.gradient,
      onChange: (event: number)=> {
        this.$emit('update:color', { ...this.color, hue: event })
      }
    })
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

  computed: {
    gradient() {
      const gradient = []
      gradient.push(`hsl(${this.color.hue}turn,0%,50%)`);
      gradient.push(`hsl(${this.color.hue}turn,100%,50%)`);
      return `linear-gradient(to right, ${gradient.join(',')})`
    },

    pointerColor() {
      const hue = this.color.hue
      const saturation = this.color.saturation
      return `hsl(${hue}turn,${saturation * 100}%,50%)`
    }
  },

  render() {
    return h(ColorPickerSliderBase, {
      color: this.color,
      pointerColor: this.pointerColor,
      value: this.color.saturation,
      title: 'Saturation',
      gradient: this.gradient,
      onChange: (event: number)=> {
        this.$emit('update:color', { ...this.color, saturation: event })
      }
    })
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

  computed: {
    gradient() {
      const gradient = []
      const hue = this.color.hue
      const saturation = this.color.saturation
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,0%)`)
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,50%)`)
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,100%)`)

      return `linear-gradient(to right, ${gradient.join(',')})`
    },

    pointerColor() {
      const hue = this.color.hue
      const saturation = this.color.saturation
      const lightness = this.color.lightness
      return `hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%)`
    }
  },

  render() {
    return h(ColorPickerSliderBase, {
      color: this.color,
      pointerColor: this.pointerColor,
      value: this.color.lightness,
      title: 'Lightness',
      gradient: this.gradient,
      onChange: (event: number)=> {
        this.$emit('update:color', { ...this.color, lightness: event })
      }
    })
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

  computed: {
    gradient() {
      const gradient = []
      const hue = this.color.hue
      const saturation = this.color.saturation
      const lightness = this.color.lightness
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%,0)`)
      gradient.push(`hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%,1)`)

      return `linear-gradient(to right, ${gradient.join(',')})`
    },

    pointerColor() {
      const hue = this.color.hue
      const saturation = this.color.saturation
      const lightness = this.color.lightness
      const alpha = this.color.alpha ?? 1
      return `hsl(${hue}turn,${saturation * 100}%,${lightness * 100}%,${alpha})`
    }
  },

  render() {
    return h(ColorPickerSliderBase, {
      color: this.color,
      pointerColor: this.pointerColor,
      value: this.color.alpha ?? 1,
      title: 'Alpha',
      gradient: this.gradient,
      onChange: (event: number)=> {
        this.$emit('update:color', { ...this.color, alpha: event })
      }
    })
  }
})
