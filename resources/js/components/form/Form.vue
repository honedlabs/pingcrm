<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
    class?: HTMLAttributes['class']
}

const { class: className } = defineProps<Props>()

interface Emits {
    (e: 'submit'): void
}

const emits = defineEmits<Emits>()

</script>

<template>
    <form @submit.prevent="emits('submit')" 
        :class="cn('space-y-8', className)"
    >
        <slot />
    </form>
</template>