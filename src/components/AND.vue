<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'
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

const {mousedown} = useDraggable()

const svg = ref<SVGElement | null>(null)

function useDraggable() {
    const dragging = ref(false)
    const {mouseCoordX, mouseCoordY, mouseX, mouseY, scale} = useStore()
    let offX = 0, offY = 0
    
    
    function mousedown(event: MouseEvent) {
        dragging.value = true
        if(svg.value) {
            const bounds = svg.value.getBoundingClientRect()
            offX = mouseX.value - bounds.left
            offY = mouseY.value - bounds.top
        }
    }

    useEventListener(document, 'mousemove', (event: MouseEvent) => {
        if(dragging.value) {

            x.value = Math.round((mouseCoordX.value - offX * scale.value) / 10) * 10
            y.value = Math.round((mouseCoordY.value - offY * scale.value) / 10) * 10
        }
    })

    useEventListener(document, 'mouseup', (event: MouseEvent) => {
        dragging.value = false
    })

    function mouseup() {
        dragging.value = false
    }

    return {mousedown, mouseup}
}

defineExpose({svg})
</script>

<template>
    <svg ref="svg" :x="x" :y="y" width="100" height="100" @mousedown.stop="mousedown">
        <path d="M 0 0 L 30 0 30 30 0 30 Z" fill="black" />
        <text x="10" y="20" fill="white">&</text>
    </svg>
</template>
  
<style>
body {
    margin: 0;
    overflow: hidden;
    user-select: none;
    font-family: Arial, Helvetica, sans-serif;
}
</style>
  