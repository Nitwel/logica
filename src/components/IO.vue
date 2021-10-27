<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { useDraggable } from '../composables/useDraggable'

export type IO = {
    position: 'top' | 'bottom' | 'left' | 'right'
    type: 'input' | 'output' | 'gap',
    label?: string
}

type Props = {
    x: number,
    y: number,
    scale: number,
    position: 'top' | 'bottom' | 'left' | 'right'
    type: 'input' | 'output' | 'gap',
    label?: string
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    position: 'right',
    type: 'output'
})
</script>

<template>
    <circle class="io no-drag" :class="{[props.type]: true}" :cx="props.x" :cy="props.y" :r="5 * props.scale" :stroke-width="props.scale" />
</template>
  
<style scoped>
.io:hover {
    stroke: black;
}

.io.input {
    fill: green;
}

.io.output {
    fill: red;
}
</style>
  