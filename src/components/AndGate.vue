<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'
import { useStore } from '../store'
import { useDraggable } from '../composables/useDraggable'

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
const svg = ref<SVGElement | null>(null)

const {mousedown} = useDraggable(svg, x, y)

defineExpose({svg})
</script>

<template>
    <svg ref="svg" class="and" :x="x" :y="y" width="100" height="100" @mousedown.stop="mousedown">
        <rect x="10" width="30" height="50" fill="black" />
        <text x="20" y="30" fill="white">&</text>
        <circle class="out no-drag" cx="10" cy="15" r="5" fill="red" />
        <circle class="out no-drag" cx="10" cy="35" r="5" fill="red" />
        <circle class="out no-drag" cx="40" cy="25" r="5" fill="red" />
    </svg>
</template>
  
<style scoped>
.and .out:hover {
    stroke: black;
}
</style>
  