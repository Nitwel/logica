<script setup lang="ts">
import { useEventListener, useVModels } from '@vueuse/core'
import { ref, computed, toRefs } from 'vue'
import { useDraggable } from '../composables/useDraggable'
import IONode from './IO.vue'

export type Box = {
    x: number,
    y: number,
    scale?: number,
    io?: IO[]
}

export type IO = {
    x?: number,
    y?: number,
    position: 'top' | 'bottom' | 'left' | 'right'
    type: 'input' | 'output' | 'gap',
    label?: string
}

const props = withDefaults(defineProps<Box>(), {
    x: 0,
    y: 0,
    scale: 1,
    io: () => []
})

const emit = defineEmits(['update:x','update:y'])

const {x, y} = useVModels(props, emit)

const { scale } = toRefs(props)
const svg = ref<SVGElement | null>(null)

const { mousedown } = useDraggable(svg, x, y, scale)

const size = computed(() => {
    let left = 0, top = 0, right = 0, bottom = 0
    props.io?.forEach(io => {
        if (io.position === 'top') top++
        else if (io.position === 'bottom') bottom++
        else if (io.position === 'left') left++
        else if (io.position === 'right') right++
    })

    const height = Math.max(left, right, 1) * 20 + 10
    const width = Math.max(top, bottom, 1) * 20 + 10
    return { width, height }
})

const circles = computed(() => {
    let left = -1, top = -1, right = -1, bottom = -1

    const offsetStart = 15, gap = 20
    return props.io.map(io => {
        let x = props.x , y = props.y
        if (io.position === 'top') {
            top++
            x += top * gap + offsetStart

        } else if (io.position === 'bottom') {
            bottom++
            x += bottom * gap + offsetStart
            y += size.value.height
        } else if (io.position === 'left') {
            left++
            y += left * gap + offsetStart
        }
        else if (io.position === 'right') {
            right++
            x += size.value.width
            y += right * gap + offsetStart
        }
        x *= props.scale
        y *= props.scale
        return {
            ...io, x, y
        }
    })
})

defineExpose({ svg })
</script>

<template>
    <g
        ref="svg"
        class="box"
        @mousedown.stop="mousedown"
    >
        <rect
            :x="x"
            :y="y"
            :width="size.width * scale"
            :height="size.height * scale"
            fill="black"
        />
        <IONode
            v-for="(io, i) in circles"
            :key="i"
            :x="io.x"
            :y="io.y"
            :scale="scale"
            :label="io.label"
            :position="io.position"
            :type="io.type"
        />
        <g x="20" y="20" width="10000" height="10000">
            <slot />
        </g>
    </g>
</template>
  
<style scoped>
</style>
  