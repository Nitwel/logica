import { computed, ref, ComponentInternalInstance, watch } from "vue";
import { createGlobalState, createSharedComposable, useStorage, VueInstance } from "@vueuse/core";
import IO from './components/IO.vue'

export const useStore = createSharedComposable(function(){
    const offsetX = ref(0)
    const offsetY = ref(0)
    const scale = ref(1)
    const mouseX = ref(0)
    const mouseY = ref(0)
    const mouseCoordX = computed(() => mouseX.value * scale.value - offsetX.value)
    const mouseCoordY = computed(() => mouseY.value * scale.value - offsetY.value)

    const hoveringIO = ref<ComponentInternalInstance | null>(null)

    watch(hoveringIO, (newVal) => {
        console.log(newVal)
    })

    return {mouseX, mouseY, offsetX, offsetY, scale, mouseCoordX, mouseCoordY, hoveringIO}
})