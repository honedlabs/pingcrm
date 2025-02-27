import { computed, reactive } from "vue"
import type { InlineAction, BulkAction, PageAction, BaseAction } from "./action"
import type { FormDataConvertible, Method, VisitOptions } from '@inertiajs/core'
import { router } from '@inertiajs/vue3'
import { useBulk } from "./bulk"
import { useRefine } from "./refine"
import type { Direction, Refine, Keys as RefineKeys } from "./refine"

export type Identifier = string | number

export interface Column<T extends Record<string, any>> {
    name: keyof T
    label: string
    type: 'text' | 'number' | 'date' | 'boolean' | string
    hidden: boolean
    toggle: boolean
    icon?: string
    class?: string
    meta?: Record<string, any>
    active: boolean
    sort?: {
        direction: Direction
        next: string | null
    }
}

export interface Keys extends RefineKeys {
    record: string
    records: string
    columns: string
    pages: string
}

export type PaginatorKind = 'cursor' | 'length-aware' | 'simple' | 'collection'

export interface PaginatorLink {
    url: string | null
    label: string
    active: boolean
}

export interface Paginator {
    prev: string | null
    next: string | null
    perPage: number
}

export interface CursorPaginator extends Paginator { }

export interface SimplePaginator extends Paginator {
    current: number
}

export interface LengthAwarePaginator extends SimplePaginator {
    total: number
    from: number
    to: number
    first: string
    last: string
    links: PaginatorLink[]
}

export interface Page {
    value: number
    active: boolean
}

export interface Table<
    T extends Record<string, any> = any,
    U extends PaginatorKind = 'length-aware',
> {
    table: string
    records: T[] & { actions: InlineAction[] }
    meta: U extends 'length-aware' 
        ? LengthAwarePaginator
        : (U extends 'simple' 
            ? SimplePaginator
            : (U extends 'cursor'
                ? CursorPaginator
                : Record<string, any>)), 
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
    K extends T[keyof T] extends Refine ? keyof T : never,
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
    
    /**
     * The heading columns for the table.
     */
    const headings = computed(() => table.value.columns
        .filter(({ active, hidden }) => active && ! hidden)
        .map(column => ({
            ...column,
            applySort: (options: VisitOptions = {}) => sortColumn(column, options)
        }))
    )

    /**
     * All of the table's columns
     */
    const columns = computed(() => table.value.columns
        .map(column => ({
            ...column,
            toggleColumn: (options: VisitOptions = {}) => toggleColumn(column, options)
        }))
    )

    /**
     * The records of the table.
     */
    const records = computed(() => table.value.records.map(record => ({
        ...record,
        /** Perform this action when the record is clicked */
        default: (options: VisitOptions = {}) => {
            const defaultAction = record.actions.find((action: InlineAction) => action.default)

            if (defaultAction) {
                executeInlineAction(defaultAction, record, options)
            }
        },
        /** The actions available for the record */
        actions: record.actions.map((action: InlineAction) => ({
            ...action,
            /** Executes this action */
            execute: (options: VisitOptions = {}) => executeInlineAction(action, record, options)
        })),
        /** Selects this record */
        select: () => bulk.select(getRecordKey(record)),
        /** Deselects this record */
        deselect: () => bulk.deselect(getRecordKey(record)),
        /** Toggles the selection of this record */
        toggle: () =>bulk.toggle(getRecordKey(record)),
        /** Determine if the record is selected */
        selected: bulk.selected(getRecordKey(record)),
        /** Bind the record to a checkbox */
        bind: () => bulk.bind(getRecordKey(record)),
    })))

    /**
     * The available bulk actions.
     */
    const bulkActions = computed(() => table.value.actions.bulk.map(action => ({
        ...action,
        /** Executes this bulk action */
        execute: (options: VisitOptions = {}) => executeBulkAction(action, options)
    })))

    /**
     * The available page actions.
     */
    const pageActions = computed(() => table.value.actions.page.map(action => ({
        ...action,
        /** Executes this page action */
        execute: (options: VisitOptions = {}) => executePageAction(action, options)
    })))
    
    /**
     * Available number of records to display per page.
     */
    const pages = computed(() => table.value.pages.map(page => ({
        ...page,
        /** Changes the number of records to display per page */
        apply: (options: VisitOptions = {}) => applyPage(page, options)
    })))

    /**
     * The current number of records to display per page.
     */
    const currentPage = computed(() => table.value.pages.find(({ active }) => active))

    /**
     * The paginator metadata.
     */
    const paginator = computed(() => table.value.meta)

    /**
     * Get the identifier of the record.
     */
    function getRecordKey(record: U) {
        return record[keys.value.record] as Identifier
    }

    /**
     * Make an Inertia request to the given route.
     */
    function visitAction(action: BaseAction, options: VisitOptions = {}) {
        router.visit(action.href!, {
            ...options,
            method: action.method!,
        })
    }

    /**
     * Execute an action at the table endpoint.
     */
    function executeAction(action: BaseAction, data: Record<string, any>, options: VisitOptions = {}) {
        router.post(table.value.endpoint, {
            ...data,
            name: action.name,
            table: table.value.table,
        }, options)
    }
    
    /**
     * Execute an inline action.
     */
    function executeInlineAction(action: InlineAction, record: U, options: VisitOptions = {}) {
        if (action.href) {
            visitAction(action, options)

            return
        }
        
        if (action.action) {
            executeAction(action, {
                type: 'inline',
                id: getRecordKey(record),
            }, options)

            return
        }
        
        tableOptions.recordActions?.[action.name]?.(record)
    }

    /**
     * Execute a bulk action.
     */
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
            }, {
                ...options,
                onSuccess: (page) => {
                    options.onSuccess?.(page)
                    
                    if (!action.keepSelected) {
                        bulk.deselectAll()
                    }
                },
            })

            return
        }
    }
    
    /**
     * Execute a page action.
     */
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

    /**
     * Apply a new page by changing the number of records to display.
     */
    function applyPage(page: Page, options: VisitOptions = {}) {
        router.reload({
            ...options,
            data: {
                [keys.value.records]: page.value,
                ['page']: undefined
            }
        })
    }

    /**
     * Apply a column sort.
     */
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

    /**
     * Toggle a column's visibility.
     */
    function toggleColumn(column: Column<U>, options: VisitOptions = {}) {
        let params = headings.value.map(({ name }) => name)

        // Toggle the column's visibility in the list of active columns.
        if (params.includes(column.name)) {
            params = params.filter((name) => name !== column.name)
        } else {
            params.push(column.name)
        }

        router.reload({
            ...options,
            data: {
                [keys.value.columns]: params.join(','),
            },
        })
    }

    return reactive({
        headings,
        columns,
        records,
        bulkActions,
        pageActions,
        pages,
        currentPage,
        paginator,
        /** Select all records */
        selectAll: bulk.selectAll,
        /** Deselect all records */
        deselectAll: bulk.deselectAll,
        /** Bind the select all checkbox */
        bindAll: bulk.bindAll,
        /** Bind the given record to a checkbox */
        bind: (record: U) => bulk.bind(getRecordKey(record)),
        /** Determine if all records are selected */
        allSelected: bulk.allSelected,
        /** The current selection of records */
        selection: bulk.selection,
        /** Select the given records */
        select: (record: U) => bulk.select(getRecordKey(record)),
        /** Deselect the given records */
        deselect: (record: U) => bulk.deselect(getRecordKey(record)),
        /** Toggle the selection of the given records */
        toggle: (record: U) => bulk.toggle(getRecordKey(record)),
        /** Determine if the given record is selected */
        selected: (record: U) => bulk.selected(getRecordKey(record)),
        /** Determine if any records are selected */
        hasSelected: bulk.hasSelected,
        /** Include the sorts, filters, and search query */
        bulk,
        ...refine
    })
}