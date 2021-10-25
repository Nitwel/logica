import { computed, ref } from "vue";
import { createGlobalState, createSharedComposable, useStorage } from "@vueuse/core";

export const useStore = createSharedComposable(function(){
    const offsetX = ref(0)
    const offsetY = ref(0)
    const scale = ref(1)
    const mouseX = ref(0)
    const mouseY = ref(0)
    const mouseCoordX = computed(() => mouseX.value * scale.value - offsetX.value)
    const mouseCoordY = computed(() => mouseY.value * scale.value - offsetY.value)

    return {mouseX, mouseY, offsetX, offsetY, scale, mouseCoordX, mouseCoordY}
})