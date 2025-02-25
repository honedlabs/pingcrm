import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Loader } from './Loader.vue'

export const loaderVariants = cva(
    'animate-spin',
    {
        variants: {
            variant: {
                primary: 'text-primary-foreground/50 fill-primary-foreground',
            },
            size: {
                sm: 'size-4',
                md: 'size-6',
                lg: 'size-8',
            }

        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
)

export type LoaderVariants = VariantProps<typeof loaderVariants>
