<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useStore } from '../store'

type Props = {
    width?: number,
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    width: 0,
    height: 0
})

const gridSpace = 20

const {offsetX, offsetY} = useStore()

const lineCount = computed(() => ({
    x: Math.floor(props.width / gridSpace) + 1, y: Math.floor(props.height / gridSpace) + 1    
}))

const path = computed(() => {
    const lineOffsetX = offsetX.value % gridSpace
    const lineOffsetY = offsetY.value % gridSpace

    let path = ""

    for(let i = 0; i < lineCount.value.x * gridSpace; i += gridSpace) {
        path += `M ${i + lineOffsetX} 0 L ${i + lineOffsetX} ${props.height} `
    }

    return path + ' Z'
})

</script>

<template>
    <svg ref="svg" x="0" y="0" :width="props.width" :height="props.height">
        <path :d="path" stroke="lightgray" />
    </svg>
</template>
  
<style scoped>

</style>
  