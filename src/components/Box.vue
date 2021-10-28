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
    scale?: number,
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

    const offsetStart = 25, gap = 20
    return props.io.map(io => {
        if (io.position === 'top') {
            top++
            return {
                ...io,
                x: top * gap + offsetStart,
                y: 10
            }

        } else if (io.position === 'bottom') {
            bottom++
            return {
                ...io,
                x: bottom * gap + offsetStart,
                y: 10 + size.value.height
            }
        } else if (io.position === 'left') {
            left++
            return {
                ...io,
                x: 10,
                y: left * gap + offsetStart
            }
        }
        else if (io.position === 'right') {
            right++
            return {
                ...io,
                x: size.value.width + 10,
                y: right * gap + offsetStart
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

defineExpose({ svg })
</script>

<template>
    <svg
        ref="svg"
        class="box"
        :x="x - 10 * scale"
        :y="y - 10 * scale"
        :width="(size.width + 20) * scale"
        :height="(size.height + 20) * scale"
        @mousedown.stop="mousedown"
    >
        <rect
            :x="10 * scale"
            :y="10 * scale"
            :width="size.width * scale"
            :height="size.height * scale"
            fill="black"
        />
        <IONode
            v-for="(io, i) in circles"
            :key="i"
            :x="io.x * scale"
            :y="io.y * scale"
            :absX="(io.x + props.x) * scale"
            :absY="(io.y + props.y) * scale"
            :scale="scale"
            :label="io.label"
            :position="io.position"
            :type="io.type"
        />
        <g x="20" y="20" width="10000" height="10000">
            <slot />
        </g>
    </svg>
</template>
  
<style scoped>
</style>
  