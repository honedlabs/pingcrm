import { computed, reactive } from "vue"
import { executeAction } from "./action"
import type { InlineAction, BulkAction, PageAction } from "./action"
import type { VisitOptions } from '@inertiajs/core'
import { router } from '@inertiajs/vue3'
import { useBulk } from "./bulk"
import { useRefine } from "./refine"
import type { Direction, Refine, Config as RefineConfig } from "./refine"

export type Identifier = string | number


interface Config extends RefineConfig {
    endpoint: string
    record: string
    records: string
    columns: string
    pages: string
}

type PaginatorKind = 'cursor' | 'length-aware' | 'simple' | 'collection'

export interface PaginatorLink {
    url: string | null
    label: string
    active: boolean
}

export interface CollectionPaginator {
    empty: boolean
}

export interface CursorPaginator extends CollectionPaginator {
    prevLink: string | null
    nextLink: string | null
    perPage: number
}

export interface SimplePaginator extends CursorPaginator {
    currentPage: number
}

export interface LengthAwarePaginator extends SimplePaginator {
    total: number
    from: number
    to: number
    firstLink: string | null
    lastLink: string | null
    links: PaginatorLink[]
}

export interface PerPageRecord {
    value: number
    active: boolean
}

export interface Column<T extends Record<string, any>> {
    name: keyof T
    label: string
    type: 'text' | 'number' | 'date' | 'boolean' | string
    hidden: boolean
    active: boolean
    toggleable: boolean
    icon?: string
    class?: string
    meta?: Record<string, any>
    sort?: {
        direction: Direction
        next: string | null
    }
}

export interface Table<
    T extends Record<string, any> = any,
    U extends PaginatorKind = 'length-aware',
> extends Refine {
    id: string
    records: T[] & { actions: InlineAction[] }
    paginator: U extends 'length-aware' 
        ? LengthAwarePaginator
        : (U extends 'simple' 
            ? SimplePaginator
            : (U extends 'cursor'
                ? CursorPaginator
                : CollectionPaginator)), 
    columns: Column<T>[]
    recordsPerPage: PerPageRecord[]
    toggleable: boolean
    actions: {
        hasInline: boolean
        bulk: BulkAction[]
        page: PageAction[]
    }
    config: Config
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
    tableOptions: TableOptions<U> = {},
    defaultOptions: VisitOptions = {},
) {
    defaultOptions = {
        ...defaultOptions,
        only: [...((defaultOptions.only ?? []) as string[]), key.toString()]
    }

    const table = computed(() => props[key] as Table<U, V>)
    const bulk = useBulk()
    const refine = useRefine<T, K>(props, key, defaultOptions)
    const config = computed(() => table.value.config)
    
    /**
     * The heading columns for the table.
     */
    const headings = computed(() => table.value.columns
        .filter(({ active, hidden }) => active && ! hidden)
        .map(column => ({
            ...column,
            applySort: (options: VisitOptions = {}) => sortColumn(column, options),
        }))
    )

    /**
     * All of the table's columns
     */
    const columns = computed(() => table.value.columns
        .filter(({ hidden }) => ! hidden)
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
    const rowsPerPage = computed(() => table.value.recordsPerPage.map(page => ({
        ...page,
        /** Changes the number of records to display per page */
        apply: (options: VisitOptions = {}) => applyPage(page, options)
    })))

    /**
     * The current number of records to display per page.
     */
    const currentPage = computed(() => table.value.recordsPerPage.find(({ active }) => active))

    /**
     * The paginator metadata.
     */
    const paginator = computed(() => ({
        ...table.value.paginator,
        next: (options: VisitOptions = {}) => {
            if ('nextLink' in paginator.value && paginator.value.nextLink) {
                toPage(paginator.value.nextLink, options)
            }
        },
        previous: (options: VisitOptions = {}) => {
            if ('prevLink' in paginator.value && paginator.value.prevLink) {
                toPage(paginator.value.prevLink, options)
            }
        },
        first: (options: VisitOptions = {}) => {
            if ('firstLink' in paginator.value && paginator.value.firstLink) {
                toPage(paginator.value.firstLink, options)
            }
        },
        last: (options: VisitOptions = {}) => {
            if ('lastLink' in paginator.value && paginator.value.lastLink) {
                toPage(paginator.value.lastLink, options)
            }
        },
        ...('links' in table.value.paginator && table.value.paginator.links ? {
            links: table.value.paginator.links.map(link => ({
                ...link,
                navigate: (options: VisitOptions = {}) => link.url && toPage(link.url, options)
            }))
        } : {})
    }))

    /**
     * Whether all records on the current page are selected.
     */
    const isPageSelected = computed(() => table.value.records.length > 0 
        && table.value.records.every((record: U) => bulk.selected(getRecordKey(record))))


    /**
     * Get the identifier of the record.
     */
    function getRecordKey(record: U) {
        return record[config.value.record] as Identifier
    }

    function toPage(link: string, options: VisitOptions = {}) {
        router.visit(link, {
            ...defaultOptions,
            ...options,
            preserveState: true,
            method: 'get',
        })
    }

    /**
     * Execute an inline action.
     */
    function executeInlineAction(
        action: InlineAction, 
        record: U, 
        options: VisitOptions = {}
    ) {
        const success =executeAction<'inline'>(action, config.value.endpoint, {
            table: table.value.id,
            id: getRecordKey(record),
        }, options)
        
        if (! success) {
            tableOptions.recordActions?.[action.name]?.(record)
        }
    }

    /**
     * Execute a bulk action.
     */
    function executeBulkAction(action: BulkAction, options: VisitOptions = {}) {
        executeAction<'bulk'>(action, config.value.endpoint, {
            table: table.value.id,
            all: bulk.selection.value.all,
            only: Array.from(bulk.selection.value.only),
            except: Array.from(bulk.selection.value.except),
        }, options)
    }
    
    /**
     * Execute a page action.
     */
    function executePageAction(action: PageAction, options: VisitOptions = {}) {
        executeAction<'page'>(action, config.value.endpoint, {
            table: table.value.id,
        }, options)
    }

    /**
     * Apply a new page by changing the number of records to display.
     */
    function applyPage(page: PerPageRecord, options: VisitOptions = {}) {
        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [config.value.records]: page.value,
                [config.value.pages]: undefined
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
            ...defaultOptions,
            ...options,
            data: {
                [config.value.sorts]: refine.omitValue(column.sort.next),
            }
        })
    }

    /**
     * Toggle a column's visibility.
     */
    function toggleColumn(column: Column<U>, options: VisitOptions = {}) {
        const params = refine.toggleValue(
            column.name,
            headings.value.map(({ name }) => name)
        )

        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [config.value.columns]: refine.delimitArray(params),
            },
        })
    }

    /**
     * Selects records on the current page.
     */
    function selectPage() {
        bulk.select(...table.value.records.map((record: U) => getRecordKey(record)))
    }

    /**
     * Deselects records on the current page.
     */
    function deselectPage() {
        bulk.deselect(...table.value.records.map((record: U) => getRecordKey(record)))
    }

    /**
     * Bind the select all checkbox to the current page.
     */
    function bindPage() {
        return {
            'onUpdate:modelValue': (checked: boolean | 'indeterminate') => {
                if (checked) {
                    selectPage()
                } else {
                    deselectPage()
                }
            },
            modelValue: isPageSelected.value,
        }
    }
    return reactive({
        headings,
        columns,
        records,
        bulkActions,
        pageActions,
        rowsPerPage,
        currentPage,
        paginator,
        isPageSelected,
        selectPage,
		deselectPage,
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
        /** Bind the select all checkbox to the current page */
        bindPage,
        /** Bind the given record to a checkbox */
        bind: (record: U) => bulk.bind(getRecordKey(record)),
        /** Include the sorts, filters, and search query */
        ...refine
    })
}