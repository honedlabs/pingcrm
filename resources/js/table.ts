import { computed } from "vue"
import type { InlineAction, BulkAction, PageAction } from "./action"
import type { FormDataConvertible, Method, VisitOptions } from '@inertiajs/core'
import { router } from '@inertiajs/vue3'
import { useBulk } from "./bulk"
import { useRefine } from "./refine"
import type { Refine, Keys as RefineKeys } from "./refine"

export interface Paginator<T> {
    data: T[]
  // Add other paginator properties as needed
}

export interface SimplePaginator<T> extends Paginator<T> {
  // Add simple paginator specific properties
}

export interface CursorPaginator<T> extends Paginator<T> {
  // Add cursor paginator specific properties
}

export type PaginatorKind = 'cursor' | 'length-aware' | 'simple' | 'collection'

export type Identifier = string | number

export interface ActionOptions extends VisitOptions {
  data?: Record<string, any>
}

export interface Column<T extends Record<string, any>> {
    name: keyof T
    label: string
    active: boolean
    sortable: boolean
}

export interface Page {
    value: number
    active: boolean
}

export interface Keys extends RefineKeys {
    record: string
    records: string
    columns: string
}

export interface Table<
    T extends Record<string, any> = any,
    U extends 'cursor' | 'length-aware' | 'simple' | 'collection' = 'length-aware',
> {
    table: string
    records: T[]
    meta: Exclude<U extends 'cursor' 
        ? CursorPaginator<T> 
        : (U extends 'simple' 
            ? SimplePaginator<T> 
            : Paginator<T>), 'data'
    >
    columns: Column<T>[]
    pages: Page[]
    toggle: boolean
    actions: {
        actions: BulkAction[]
        inline: InlineAction[]
        page: PageAction[]
    }
    endpoint: string
    keys: Keys
}

export function executeInlineAction(action: InlineAction, id: Identifier, options: ActionOptions = {}) {
    if (action.route) {
        return router.visit(action.route.href, {
            ...options,
            method: action.route.method,
            data: {
                ...options.data,
                name: action.name,
            }
        })
    }
}

export function useTable<
    T extends object,
    K extends {
        [K in keyof T]: T[K] extends any ? K : never
    }[keyof T]
>(props: T, key: K) {
    const table = computed(() => props[key] as Table<any>)
    const bulk = useBulk()
    const refine = useRefine(props, key as any)
    const keys = computed(() => table.value.keys)
    const endpoint = computed(() => table.value.endpoint)

    return {
        table,
        bulk,
        refine,
        keys,
        endpoint
    }
}