import { computed, reactive } from "vue"
import type { InlineAction, BulkAction, PageAction, BaseAction } from "./action"
import type { FormDataConvertible, Method, VisitOptions } from '@inertiajs/core'
import { router } from '@inertiajs/vue3'
import { useBulk } from "./bulk"
import { useRefine } from "./refine"
import type { Direction, Refine, Keys as RefineKeys } from "./refine"

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

export interface Column<T extends Record<string, any>> {
    name: keyof T
    label: string
    active: boolean
    sort?: {
        direction: Direction
        next: string | null
    }
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
    records: T[] & { actions: InlineAction[] }
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
        bulk: BulkAction[]
        page: PageAction[]
    }
    endpoint: string
    keys: Keys
}

export interface TableOptions<T extends Record<string, any>> {
    /**
     * Actions to be applied on a record in JavaScript.
     */
    recordActions?: Record<string, (record: T) => void>
}

export function useTable<
    T extends object,
    K extends {
        [K in keyof T]: T[K] extends any ? K : never
    }[keyof T],
    U extends Record<string, any> = any,
    V extends 'cursor' | 'length-aware' | 'simple' | 'collection' = 'length-aware',
>(
    props: T, 
    key: K, 
    tableOptions: TableOptions<U> = {}
) {
    const table = computed(() => props[key] as Table<U, V>)

    const bulk = useBulk()

    const refine = useRefine<T, K>(props, key)

    const keys = computed(() => table.value.keys)

    function visitAction(action: BaseAction, options: VisitOptions = {}) {
        router.visit(action.href!, {
            ...options,
            method: action.method!,
        })
    }

    function executeAction(action: BaseAction, data: Record<string, any>, options: VisitOptions = {}) {
        router.post(table.value.endpoint, {
            ...data,
            name: action.name,
            table: table.value.table,
        }, options)
    }
    
    function executeInlineAction(action: InlineAction, record: U, options: VisitOptions = {}) {
        if (action.href) {
            console.log('Hits')
            visitAction(action, options)
            return
        }
        
        if (action.action) {
            executeAction(action, {
                type: 'inline',
                id: record[keys.value.record as keyof typeof record] as Identifier,
            }, options)
            return
        }
        
        tableOptions.recordActions?.[action.name]?.(record)
    }
    
    function executeBulkAction(action: BulkAction, options: VisitOptions = {}) {
        if (action.href) {
            visitAction(action, options)
            return
        }

        if (action.action) {
            executeAction(action, {
                type: 'bulk',
                all: bulk.selection.value.all,
                only: Array.from(bulk.selection.value.only),
                except: Array.from(bulk.selection.value.except),
            }, options)
        }
    }
    
    function executePageAction(action: PageAction, options: VisitOptions = {}) {
        if (action.href) {
            visitAction(action, options)
            return
        }

        if (action.action) {
            executeAction(action, {
                type: 'page',
            }, options)
            return
        }
    }

    function applyPage(page: Page, options: VisitOptions = {}) {
        router.reload({
            ...options,
            data: {
                [keys.value.records]: page.value,
                ['page']: undefined
            }
        })
    }

    function sortColumn(column: Column<U>, options: VisitOptions = {}) {
        if (! column.sort) {
            return
        }

        router.reload({
            ...options,
            data: {
                [keys.value.sorts]: column.sort.next,
            }
        })
    }

    return reactive({
        table,
        /**
         * All of the table's columns
         */
        columns: table.value.columns.map(column => ({
            ...column,
            sort: (options: VisitOptions = {}) => sortColumn(column, options)
        })),
        /**
         * The data for the table.
         */
        records: table.value.records.map(record => ({
            ...record,
            actions: record.actions.map((action: InlineAction) => ({
                ...action,
                execute: (options: VisitOptions = {}) => executeInlineAction(action, record, options)
            }))
        })),
        /**
         * Available bulk actions.
         */
        bulkActions: table.value.actions.bulk.map(action => ({
            ...action,
            execute: (options: VisitOptions = {}) => executeBulkAction(action, options)
        })),
        /**
         * Available page actions.
         */
        pageActions: table.value.actions.page.map(action => ({
            ...action,
            execute: (options: VisitOptions = {}) => executePageAction(action, options)
        })),
        /**
         * Available number of records to display per page.
         */
        pages: table.value.pages.map(page => ({
            ...page,
            apply: (options: VisitOptions = {}) => applyPage(page, options)
        })),
        /**
         * The current number of records to display per page.
         */
        currentPage: computed(() => table.value.pages.find(({ active }) => active)),
        /**
         * The paginator metadata.
         */
        paginator: computed(() => table.value.meta),
        bulk,
        ...refine
    })
}