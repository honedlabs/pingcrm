import { computed, reactive, ref, type Ref } from "vue"
import { router } from "@inertiajs/vue3"
import type { VisitOptions } from "@inertiajs/core"
import { toReactive, useDebounceFn } from "@vueuse/core"

export interface Refiner {
    name: string
    label: string
    type: string
    active: boolean
    meta: Record<string, any>
}

export type Direction = 'asc' | 'desc' | null

export interface Sort extends Refiner {
    type: 'sort' | string
    direction: Direction
    next: string | null
}

export type FilterValue = string | number | boolean | null

export type KnownFilter = 'filter' | 'set' | 'date' | 'boolean' | string

export interface FilterRefiner extends Refiner {
    type: KnownFilter | string
    value: FilterValue
}

export interface Option {
    label: string
    value: FilterValue
    active: boolean
}

export interface SetFilterRefiner extends FilterRefiner {
    type: 'set'
    multiple: boolean
    options: Option[]
}

export interface DateFilterRefiner extends FilterRefiner {
    type: 'date'
    value: string
}

export interface BooleanFilterRefiner extends FilterRefiner {
    type: 'boolean'
    value: boolean
}

type Filter = SetFilterRefiner | DateFilterRefiner | BooleanFilterRefiner | FilterRefiner

export interface Search extends Refiner { }

export interface Config {
    delimiter: string
    search: string | null
    searches: string
    sorts: string
    matches?: string
}

export interface Refine {
    sorts: Sort[]
    filters: Filter[]
    config: Config
    searches?: Search[]
}

export interface BindingOptions extends VisitOptions {
    /**
     * Transform the value before it is applied.
     */
    transform?: (value: any) => any

    /**
     * The debounce time in milliseconds.
     * 
     * @default 250
     */
    debounce?: number
}

export function useRefine<
    T extends object,
    K extends T[keyof T] extends Refine ? keyof T : never,
>(
    props: T, 
    key: K, 
    defaultOptions: VisitOptions = {}
) {
    const refinements = computed(() => props[key] as Refine)

    /**
     * The available filters.
     */
    const filters = computed(() => refinements.value.filters.map(filter => ({
        ...filter,
        apply: (value: T, options: VisitOptions = {}) => applyFilter(filter, value, options),
        clear: (options: VisitOptions = {}) => clearFilter(filter, options),
        bind: () => bindFilter(filter.name)
    })))

    /**
     * The available sorts.
     */
    const sorts = computed(() => refinements.value.sorts.map(sort => ({
        ...sort,
        apply: (options: VisitOptions = {}) => applySort(sort, sort.direction, options),
        clear: (options: VisitOptions = {}) => clearSort(options),
        bind: () => bindSort(sort)
    })))

    /**
     * Converts an array parameter to a comma-separated string for URL parameters.
     */
    function delimitArray(value: any) {
        if (Array.isArray(value)) {
            return value.join(refinements.value.config.delimiter)
        }

        return value
    }

    /**
     * Formats a string value for search parameters.
     */
    function stringValue(value: any) {
        if (typeof value !== 'string') {
            return value
        }

        return value.trim().replace(/\s+/g, '+')
    }

    /**
     * Returns undefined if the value is an empty string, null, or undefined.
     */
    function omitValue(value: any) {
        if (['', null, undefined, []].includes(value)) {
            return undefined
        }

        return value
    }

    /**
     * Toggle the presence of a value in an array.
     */
    function toggleValue(value: any, values: any) {
        values = Array.isArray(values) ? values : [values];

        if (values.includes(value)) {
            return values.filter((item: any) => item !== value)
        }

        return [...values, value]
    }

    /**
     * Gets a sort by name.
     */
    function getSort(name: string, direction: Direction = null): Sort | undefined {
        return refinements.value.sorts.find(sort => sort.name === name && sort.direction === direction)
    }

    /**
     * Gets a filter by name.
     */
    function getFilter(name: string): Filter | undefined {
        return refinements.value.filters.find(filter => filter.name === name)
    }

    /**
     * Gets a search by name.
     */
    function getSearch(name: string): Search | undefined {
        return refinements.value.searches?.find(search => search.name === name)
    }

    /**
     * The current sort.
     */
    function currentSort(): Sort | undefined {
        return refinements.value.sorts.find(({ active }) => active)
    }

    /**
     * The current filters.
     */
    function currentFilters(): FilterRefiner[] {
        return refinements.value.filters.filter(({ active }) => active)
    }

    /**
     * The current searches.
     */
    function currentSearches(): Search[] {
        return refinements.value.searches?.filter(({ active }) => active) ?? []
    }

    /**
     * Whether the given sort is currently active.
     */
    function isSorting(name?: string): boolean {
        if (name) {
            return currentSort()?.name === name
        }

        return !!currentSort()
    }

    /**
     * Whether the given filter is currently active.
     */
    function isFiltering(name?: string): boolean {
        if (name) {
            return currentFilters().some(filter => filter.name === name)
        }

        return !!currentFilters().length
    }

    /**
     * Whether the search is currently active, or on a given match.
     */
    function isSearching(name?: string): boolean {
        if (name) {
            return currentSearches()?.some(search => search.name === name)
        }

        return !!currentSearches()?.length
    }

    /**
     * Applies the given filter.
     */
    function applyFilter(filter: Filter | string, value: any, options: VisitOptions = {}) {
        const refiner = typeof filter === 'string' ? getFilter(filter) : filter
        
        if (!refiner) {
            console.warn(`Filter [${filter}] does not exist.`)
            return
        }
        
        if ('multiple' in refiner && refiner.multiple) {
            value = toggleValue(value, refiner.value)
        }

        value = [delimitArray, stringValue, omitValue]
            .reduce((result, transform) => transform(result), value)

        console.log(value)
        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refiner.name]: value
            }
        })
    }

    /**
     * Applies the given sort.
     */
    function applySort(sort: Sort | string, direction: Direction = null, options: VisitOptions = {}) {
        const refiner = typeof sort === 'string' ? getSort(sort, direction) : sort

        if (!refiner) {
            console.warn(`Sort [${sort}] does not exist.`)
            return
        }

        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.config.sorts]: omitValue(refiner.next)
            }
        })
    }

    /**
     * Applies a text search.
     */
    function applySearch(value: string | null | undefined, options: VisitOptions = {}) {
        value = [stringValue, omitValue]
            .reduce((result, transform) => transform(result), value)

        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.config.searches]: value
            }
        })
    }

    /**
     * Clear the given filter.
     */
    function clearFilter(filter: Filter | string, options: VisitOptions = {}) {
        applyFilter(filter, undefined, options)
    }

    /**
     * Clear the sort.
     */
    function clearSort(options: VisitOptions = {}) {
        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.config.sorts]: null
            }
        })
    }

    /**
     * Clear the search.
     */
    function clearSearch(options: VisitOptions = {}) {
        applySearch(undefined, options)
    }

    /**
     * Resets all filters, sorts, matches and search.
     */
    function reset(options: VisitOptions = {}) {
        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.config.searches]: undefined,
                [refinements.value.config.sorts]: undefined,
                ...Object.fromEntries(
                    refinements.value.filters.map(filter => [filter.name, undefined])
                ),
                ...(refinements.value.config.matches 
                    ? { [refinements.value.config.matches]: undefined } 
                    : {}
                )
            }
        })
    }

    /**
     * Binds a filter to a form input.
     */
    function bindFilter<T extends any>(filter: Filter | string, options: BindingOptions = {}) {
        const refiner = typeof filter === 'string' ? getFilter(filter) : filter

        if (!refiner) {
            console.warn(`Filter [${filter}] does not exist.`)
            return
        }

        const value = refiner.value as T

        const { 
            debounce = 250,
            transform = (value: any) => value,
            ...visitOptions
        } = options;

        return {
            'onUpdate:modelValue': useDebounceFn((value: any) => {
                applyFilter(refiner, transform(value), visitOptions)
            }, debounce),
            modelValue: value,
            value: value,
        }
    }

    /**
     * Binds a sort to a button.
     */
    function bindSort(sort: Sort | string, options: BindingOptions = {}) {
        const refiner = typeof sort === 'string' ? getSort(sort) : sort

        if (!refiner) {
            console.warn(`Sort [${sort}] does not exist.`)
            return
        }

        const { debounce = 0, transform, ...visitOptions } = options;
        return {
            'onClick': useDebounceFn(() => {
                applySort(refiner, currentSort()?.direction, visitOptions)
            }, debounce)
        }
    }

    /**
     * Binds a search input to a form input.
     */
    function bindSearch(options: BindingOptions = {}) {
        const { debounce = 700, transform, ...visitOptions } = options;

        return {
            'onUpdate:modelValue': useDebounceFn((value: any) => {
                applySearch(value, visitOptions)
            }, debounce),
            modelValue: refinements.value.config.search ?? ''
        }
    }

    return {
        // refinements,
        filters,
        sorts,
        // searches,
        getSort,
        getFilter,
        getSearch,
        currentSort,
        currentFilters,
        currentSearches,
        isSorting,
        isFiltering,
        isSearching,
        applyFilter,
        applySort,
        applySearch,
        clearFilter,
        clearSort,
        clearSearch,
        reset,
        bindFilter,
        bindSort,
        // bindMatch,
        bindSearch,
        /** Provide the helpers */
        stringValue,
        omitValue,
        toggleValue,
        delimitArray,
    }
}
