<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { textVariants, type TextVariants } from '.'
import { HTMLAttributes } from 'vue'

interface Props extends PrimitiveProps {
    class?: HTMLAttributes['class']
    variant?: TextVariants
}

const { variant, class: className, ...props } = defineProps<Props>()

</script>

<template>
    <Primitive :class="cn(textVariants({ variant }), className)" v-bind="props">
        <slot />
    </Primitive>
</template>
