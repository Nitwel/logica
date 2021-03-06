<script setup lang="ts">
import { ref, computed, withDefaults } from 'vue'
import { useEventListener } from '@vueuse/core'
import AndGate from './AndGate.vue'
import {useStore} from '../store'
import Grid from './Grid.vue'
import Switch from './Switch.vue'
import Box from './Box.vue'

type Props = {
    width?: number,
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    width: 0,
    height: 0
})

const {offsetX, offsetY, scale, mouseX, mouseY, mouseCoordX, mouseCoordY, boxTree} = useStore()

// offsetX.value = props.width / 2
// offsetY.value = props.height / 2
scale.value = 0.25

const zoomStrength = ref(0.3)

let mouseMoving = false

const viewBox = computed(() => {
    return `${-offsetX.value} ${-offsetY.value} ${props.width * scale.value} ${props.height * scale.value}`
})

useEventListener(document, 'wheel', (event: WheelEvent) => {
    const zoomStrengthWheel = zoomStrength.value * Math.abs(event.deltaY) / 100
    if(event.deltaY > 0) {
        offsetX.value += event.clientX * scale.value * zoomStrengthWheel
        offsetY.value += event.clientY * scale.value  * zoomStrengthWheel

        scale.value *= (1 + zoomStrengthWheel)
    } else {
        scale.value /= (1 + zoomStrengthWheel)
        offsetX.value -= event.clientX * scale.value * zoomStrengthWheel
        offsetY.value -= event.clientY * scale.value * zoomStrengthWheel
    }
})

useEventListener(document, 'mousedown', (event) => {
    mouseMoving = true
    mouseX.value = event.x
    mouseY.value = event.y
})

useEventListener(document, 'mousemove', (event) => {
    if(mouseMoving) {
        const dx = event.x - mouseX.value, dy = event.y - mouseY.value

        offsetX.value += dx * scale.value
        offsetY.value += dy * scale.value   
    }

    mouseX.value = event.x
    mouseY.value = event.y

    
})

useEventListener(document, 'mouseup', (event) => {
    mouseMoving = false
})

</script>

<template>
    <div class="overlay">
        <input v-model="offsetX" />
        <input v-model="offsetY" />
        <input v-model="scale" />
        <span>{{mouseCoordX}} {{mouseCoordY}}</span>
    </div>
    <!-- <Grid class="grid" :width="props.width" :height="props.height"></Grid> -->
    <svg ref="engine" class="engine" :viewBox="viewBox" :width="props.width" :height="props.height" xmlns='http://www.w3.org/2000/svg'>
        <Box v-for="(box, i) in boxTree" :key="i" v-model:x="box.x" v-model:y="box.y" :scale="box.scale" :io="box.io" ></Box>
    </svg>
</template>

<style scoped>
.overlay {
    position: absolute;
    bottom: 0;
    left: 0;
}

.overlay span {
    background-color: white;
}

.engine, .grid {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
