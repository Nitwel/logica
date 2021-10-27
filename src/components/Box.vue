<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref, computed, toRefs } from 'vue'
import { useStore } from '../store'
import { useDraggable } from '../composables/useDraggable'
import { IO } from './IO.vue'
import IONode from './IO.vue'

type Props = {
    x?: number,
    y?: number,
    scale: number,
    io?: IO[]
}

const props = withDefaults(defineProps<Props>(), {
    x: 0,
    y: 0,
    scale: 1,
    io: () => []
})

const x = ref(props.x)
const y = ref(props.y)
const {scale} = toRefs(props)
const svg = ref<SVGElement | null>(null)

const {mousedown} = useDraggable(svg, x, y, scale)

const size = computed(() => {
    let left = 0, top = 0, right = 0, bottom = 0
    props.io?.forEach(io => {
        if(io.position === 'top') top++
        else if(io.position === 'bottom') bottom++
        else if(io.position === 'left') left++
        else if(io.position === 'right') right++
    })

    const height = (Math.max(left, right, 1) * 20 + 10) * props.scale
    const width = (Math.max(top, bottom, 1) * 20 + 10) * props.scale
    return {width, height}
})

const circles = computed(() => {
    let left = -1, top = -1, right = -1, bottom = -1

    const offsetStart = 25, gap = 20
    return props.io.map(io => {
        if(io.position === 'top') {
            top++
            return {
                ...io,
                x: (top * gap + offsetStart) * props.scale,
                y: 10 * props.scale
            }
            
        } else if(io.position === 'bottom') {
            bottom++
            return {
                ...io,
                x: (bottom * gap + offsetStart) * props.scale,
                y: (10 + size.value.height) * props.scale
            }
        } else if(io.position === 'left') {
            left++
            return {
                ...io,
                x: 10 * props.scale,
                y: (left * gap + offsetStart) * props.scale
            }
        }
        else if(io.position === 'right') {
            right++
            return {
                ...io,
                x: (size.value.width + 10) * props.scale,
                y: (right * gap + offsetStart) * props.scale
            }
        } else {
            return {
                ...io,
                x: 0,
                y: 0
            }
        }
    })
})

defineExpose({svg})
</script>

<template>
    <svg ref="svg" class="box" :x="x - 10 * props.scale" :y="y - 10 * props.scale" :width="size.width + 20 * props.scale" :height="size.height + 20 * props.scale" @mousedown.stop="mousedown">
        <rect :x="10 * props.scale" :y="10 * props.scale" :width="size.width" :height="size.height" fill="black" />
        <IONode v-for="(io, i) in circles" :key="i" :x="io.x" :y="io.y" :scale="props.scale" :label="io.label" :position="io.position" :type="io.type" />
        <svg x="20" y="20" width="10000" height="10000">
            <slot />
        </svg>
    </svg>
</template>
  
<style scoped>
</style>
  