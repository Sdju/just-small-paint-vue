<template>
  <div class="app">
    <SimpleCanvas/>

    <img class="app__cursor" src="https://cursor.in/assets/cursor.svg"/>
  </div>
</template>

<script setup lang="ts">

import SimpleCanvas from './components/simple-canvas.vue';
import {useMouse} from '@vueuse/core';
import {computed} from 'vue';

const {x, y} = useMouse()
const mouseX = computed(() => x.value - 8 + 'px')
const mouseY = computed(() => y.value - 8 + 'px')

</script>

<style lang="scss" scoped>
.app {
  padding: 16px;

  &__cursor {
    width: 28px;
    height: 28px;
    position: fixed;
    left: 0;
    top: 0;
    transform: translate(v-bind(mouseX), v-bind(mouseY));
    pointer-events: none;
  }
}

</style>
