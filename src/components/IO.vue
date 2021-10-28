<script setup lang="ts">
import { useEventListener, useMagicKeys } from '@vueuse/core'
import { ref, computed, toRefs, getCurrentInstance, getCurrentScope } from 'vue'
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
    absX: number,
    absY: number,
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

const {type, x, y} = toRefs(props)

const {shift} = useMagicKeys()

const {hoveringIO} = useStore()

const emit = defineEmits(['click'])

const self = getCurrentInstance()

function mouseDown(event: MouseEvent) {
    if(shift.value) return

    hoveringIO.value = self
}

defineExpose({x: props.absX, y: props.absY})
</script>

<template>
    <circle @mousedown="mouseDown" @mouseenter="hoveringIO = self" @mouseleave="hoveringIO = null" class="io" :class="{[props.type]: true, 'no-drag': !shift}" :cx="props.x" :cy="props.y" :r="5 * props.scale" :stroke-width="props.scale" />
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
  