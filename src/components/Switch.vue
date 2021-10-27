<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'
import { useDraggable } from '../composables/useDraggable'
import { useStore } from '../store'

type Props = {
    x?: number,
    y?: number
}

const props = withDefaults(defineProps<Props>(), {
    x: 0,
    y: 0
})

const x = ref(props.x)
const y = ref(props.y)
const on = ref(false)
const svg = ref<SVGElement | null>(null)

function toggle() {
    on.value = !on.value
}

const {mousedown} = useDraggable(svg, x, y, toggle)

defineExpose({svg})
</script>

<template>
    <svg :x="x" ref="svg" :y="y" width="100" height="100" @mousedown.stop="mousedown" class="switch" :class="{on}">
        <path d="M 0 0 L 30 0 30 30 0 30 Z" :fill="on ? 'green' : 'black'" />
        <text x="10" y="20" fill="white">{{on ? '1' : '0'}}</text>
        <circle class="out no-drag" cx="30" cy="15" r="5" fill="red" />
    </svg>
</template>
  
<style scoped>
.switch .out:hover {
    stroke: black;
}
</style>
  