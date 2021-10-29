import { computed, ref, ComponentInternalInstance, watch } from "vue";
import { createGlobalState, createSharedComposable } from "@vueuse/core";

export type IO = {
    is: 'io'
    x?: number,
    y?: number,
    position: 'top' | 'bottom' | 'left' | 'right'
    type: 'input' | 'output' | 'gap',
    label?: string
}

export type Box = {
    is: 'box'
    x: number,
    y: number,
    scale?: number,
    io?: IO[]
}

export const useStore = createSharedComposable(function(){
    const offsetX = ref(0)
    const offsetY = ref(0)
    const scale = ref(1)
    const mouseX = ref(0)
    const mouseY = ref(0)
    const mouseCoordX = computed(() => mouseX.value * scale.value - offsetX.value)
    const mouseCoordY = computed(() => mouseY.value * scale.value - offsetY.value)

    const boxTree = ref<Box[]>([
        {
            is: 'box',
            x: 30,
            y: 10,
            scale: 1,
            io: [{is: 'io', type: 'input', position: 'left'}, {is: 'io', type: 'input', position: 'left'}, {is: 'io', type: 'output', position: 'right'}]
        },
        {
            is: 'box',
            x: 90,
            y: 10,
            scale: 1,
            io: [{is: 'io', type: 'input', position: 'left'}, {is: 'io', type: 'input', position: 'left'}, {is: 'io', type: 'output', position: 'right'}]
        }
    ])

    const hoveringIO = ref<ComponentInternalInstance | null>(null)

    return {mouseX, mouseY, offsetX, offsetY, scale, mouseCoordX, mouseCoordY, hoveringIO, boxTree}
})