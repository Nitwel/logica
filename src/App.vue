<template>
  <Engine :width="width" :height="height"/>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Engine from './components/Engine.vue'
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
}
</style>
