<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { useDraggable } from '../composables/useDraggable'

type IO = {
    position: 'top' | 'bottom' | 'left' | 'right'
    type: 'input' | 'output' | 'gap',
    label?: string
}

type Pos = {
    x: number,
    y: number
}

type Props = {
    x?: number,
    y?: number,
    io?: IO[]
}

const props = withDefaults(defineProps<Props>(), {
    x: 0,
    y: 0,
    io: () => []
})

const x = ref(props.x)
const y = ref(props.y)
const svg = ref<SVGElement | null>(null)

const {mousedown} = useDraggable(svg, x, y)

const size = computed(() => {
    let left = 0, top = 0, right = 0, bottom = 0
    props.io?.forEach(io => {
        if(io.position === 'top') top++
        else if(io.position === 'bottom') bottom++
        else if(io.position === 'left') left++
        else if(io.position === 'right') right++
    })

    const height = Math.max(left, right, 1) * 20 + 10
    const width = Math.max(top, bottom, 1) * 20 + 10
    return {width, height}
})

const circles = computed<(IO & Pos)[]>(() => {
    let left = -1, top = -1, right = -1, bottom = -1

    const offsetStart = 25, gap = 20
    return props.io?.map(io => {
        if(io.position === 'top') {
            top++
            return {
                ...io,
                x: top * gap + offsetStart,
                y: 10
            }
            
        } else if(io.position === 'bottom') {
            bottom++
            return {
                ...io,
                x: bottom * gap + offsetStart,
                y: 10 + size.value.height
            }
        } else if(io.position === 'left') {
            left++
            return {
                ...io,
                x: 10,
                y: left * gap + offsetStart
            }
        }
        else if(io.position === 'right') {
            right++
            return {
                ...io,
                x: size.value.width + 10,
                y: right * gap + offsetStart
            }
        }
    })
})

defineExpose({svg})
</script>

<template>
    <svg ref="svg" class="and" :x="x" :y="y" width="10000" height="10000" @mousedown.stop="mousedown">
        <rect x="10" y="10" :width="size.width" :height="size.height" fill="black" />
        <circle v-for="(circle, i) in circles" :key="i" class="out no-drag" :cx="circle.x" :cy="circle.y" r="5" :fill="circle.type === 'input'? 'green' : circle.type === 'output' ? 'red' : ''" />
        <svg x="20" y="20" width="10000" height="10000">
            <slot />
        </svg>
    </svg>
</template>
  
<style scoped>
.out:hover {
    stroke: black;
}
</style>
  