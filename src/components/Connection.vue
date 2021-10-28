<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref, ComponentInternalInstance, toRefs } from 'vue'
import { useStore } from '../store'

type Props = {
    start: ComponentInternalInstance | null,
    end: ComponentInternalInstance | null,
    scale: number
}

const props = withDefaults(defineProps<Props>(), {
    scale: 1
})

const {start, end} = toRefs(props)

const path = computed(() => {
    return `M ${start.value?.exposed?.x} ${start.value?.exposed?.y} L ${end.value?.exposed?.x} ${end.value?.exposed?.y}`
})

</script>

<template>
    <path :d="path" />
</template>
  
<style scoped>

</style>
  