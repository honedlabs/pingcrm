import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Block } from './Block.vue'

export const blockVariants = cva(
    '',
    {
        variants: {
            variant: {
                stack: 'space-y-2',
                inline: 'flex items-center gap-x-2',
            },
        },
        defaultVariants: {
            variant: 'stack',
        },
    },
)

export type BlockVariants = VariantProps<typeof blockVariants>
