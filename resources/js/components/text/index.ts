import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Text } from './Text.vue'

export const textVariants = cva(
    'text-sm/6',
    {
        variants: {
            variant: {
                default: 'text-card-foreground',
                destructive: 'text-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

export type TextVariants = VariantProps<typeof textVariants>
