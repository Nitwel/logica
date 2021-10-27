import {ref, Ref} from 'vue'
import {useEventListener} from '@vueuse/core'
import { useStore } from '../store'

export function useDraggable(element: Ref<Element | null>, x: Ref<number>, y: Ref<number>, onClick=() => {}) {
    const dragging = ref(false)
    const hasDragged = ref(true)
    const {mouseCoordX, mouseCoordY, mouseX, mouseY, scale} = useStore()
    let offX = 0, offY = 0
    
    
    function mousedown(event: MouseEvent) {
        if((event.target as Element)?.classList.contains('no-drag')) return

        dragging.value = true
        hasDragged.value = false
        if(element.value) {
            const bounds = element.value.getBoundingClientRect()
            offX = mouseX.value - bounds.left
            offY = mouseY.value - bounds.top
        }
    }

    useEventListener(document, 'mousemove', (event: MouseEvent) => {
        if(dragging.value) {
            hasDragged.value = true
            x.value = Math.round((mouseCoordX.value - offX * scale.value) / 10) * 10
            y.value = Math.round((mouseCoordY.value - offY * scale.value) / 10) * 10
        }
    })

    useEventListener(document, 'mouseup', (event: MouseEvent) => {
        dragging.value = false
        if(!hasDragged.value) onClick()
        hasDragged.value = true

    })

    return {mousedown, pressed: dragging}
}