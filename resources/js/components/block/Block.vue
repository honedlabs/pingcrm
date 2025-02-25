<script setup lang="ts">
import { cn } from '@/lib/utils';
import { blockVariants, type BlockVariants } from '.';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { HTMLAttributes } from 'vue';

interface Props extends PrimitiveProps {
    class?: HTMLAttributes['class']
    variant?: BlockVariants['variant']
}

const { class: className, variant, ...props } = defineProps<Props>()
</script>

<template>
    <Primitive v-bind="props" :class="cn(blockVariants({ variant }), className)">
        <slot />
    </Primitive>
</template>