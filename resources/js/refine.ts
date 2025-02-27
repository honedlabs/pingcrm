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

export interface SortRefiner extends Refiner {
    type: 'sort' | string
    direction: Direction
    next: string | null
}

export type FilterValue = string | number | boolean | null

export type KnownFilter = 'filter' | 'set' | 'date' | 'boolean' | 'trashed'

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

export interface SearchRefiner extends Refiner { }

export interface Keys {
    sorts: string
    searches: string
    matches?: string
}

export interface Refine {
    sorts: SortRefiner[]
    filters: Filter[]
    search: string | null
    keys: Keys
    searches?: SearchRefiner[]
}

export interface SearchOptions {
    /**
     * The debounce time in milliseconds.
     * 
     * @default 750
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

    defaultOptions = {
        ...defaultOptions,
        only: [...((defaultOptions.only ?? []) as string[]), key.toString()]
    }

    /**
     * The available filters.
     */
    const filters = computed(() => refinements.value.filters.map(filter => ({
        ...filter,
        apply: (value: T, options: VisitOptions = {}) => applyFilter(filter.name, value, options),
        clear: (options: VisitOptions = {}) => clearFilter(filter.name, options),
        bind: () => bindFilter(filter.name)
    })))

    /**
     * The available sorts.
     */
    const sorts = computed(() => refinements.value.sorts.map(sort => ({
        ...sort,
        apply: (options: VisitOptions = {}) => applySort(sort.name, sort.direction, options),
        clear: (options: VisitOptions = {}) => clearSort(options),
    })))

    /**
     * Converts an array parameter to a comma-separated string for URL parameters.
     */
    function getArrayParameter(value: any) {
        if (Array.isArray(value)) {
            return value.join(',')
        }

        return value
    }

    /**
     * Formats a string value for search parameters.
     */
    function getStringValue(value: any) {
        if (typeof value !== 'string') {
            return value
        }

        return value.trim().replace(/\s+/g, '+')
    }

    /**
     * Returns undefined if the value is an empty string, null, or undefined.
     */
    function getOmittedParameter(value: any) {
        if (['', null, undefined, []].includes(value)) {
            return undefined
        }

        return value
    }

    /**
     * Toggle the presence of a value in an array.
     */
    function getToggledParameter(value: any, values: any) {
        values = Array.isArray(values) ? values : [values];

        if (values.includes(value)) {
            return values.filter((item: any) => item !== value)
        }

        return [...values, value]
    }

    /**
     * Gets a sort by name.
     */
    function getSort(name: string, direction: Direction = null): SortRefiner|undefined {
        return refinements.value.sorts.find(sort => sort.name === name && sort.direction === direction)
    }

    /**
     * Gets a filter by name.
     */
    function getFilter(name: string): Filter | undefined {
        return refinements.value.filters.find(filter => filter.name === name)
    }

    /**
     * Gets a match by name.
     */
    function getMatch(name: string): SearchRefiner|undefined {
        return refinements.value.searches?.find(search => search.name === name)
    }

    /**
     * The current sort.
     */
    function currentSort(): SortRefiner | undefined {
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
    function currentSearches(): SearchRefiner[] {
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
    function applyFilter(name: string, value: any, options: VisitOptions = {}) {
        const filter = getFilter(name)
        
        if (!filter) {
            console.warn(`Filter [${name}] does not exist.`)
            return
        }
        
        if ('multiple' in filter && filter.multiple) {
            value = getToggledParameter(value, filter.value)
        }

        value = [getOmittedParameter, getArrayParameter, getStringValue]
            .reduce((result, transform) => transform(result), value)

        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [filter.name]: value
            }
        })
    }

    /**
     * Applies the given sort.
     */
    function applySort(name: string, direction: Direction = null, options: VisitOptions = {}) {
        const sort = getSort(name, direction)

        if (!sort) {
            console.warn(`Sort [${name}] does not exist.`)
            return
        }

        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.keys.sorts]: sort.next
            }
        })
    }

    /**
     * Applies a text search.
     */
    function applySearch(value: string | null | undefined, options: VisitOptions = {}) {
        value = [getOmittedParameter, getStringValue]
            .reduce((result, transform) => transform(result), value)

        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.keys.searches]: value
            }
        })
    }

    /**
     * Clear the given filter.
     */
    function clearFilter(name: string, options: VisitOptions = {}) {
        applyFilter(name, undefined, options)
    }

    /**
     * Clear the sort.
     */
    function clearSort(options: VisitOptions = {}) {
        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.keys.sorts]: null
            }
        })
    }

    /**
     * Resets all filters, sorts, matches and search.
     */
    function reset(options: VisitOptions = {}) {

        router.reload({
            ...defaultOptions,
            ...options,
            data: {
                [refinements.value.keys.searches]: undefined,
                [refinements.value.keys.sorts]: undefined,
                ...Object.fromEntries(
                    refinements.value.filters.map(filter => [filter.name, undefined])
                ),
                ...(refinements.value.keys.matches 
                    ? { [refinements.value.keys.matches]: undefined } 
                    : {}
                )
            }
        })
    }

    /**
     * Binds a filter to a form input.
     */
    function bindFilter<T extends any>(name: string) {
        const value = getFilter(name)?.value as T

        return {
            'onUpdate:modelValue': (value: any) => {
                applyFilter(name, value);
            },
            modelValue: value,
            value: value,
        }
    }

    /**
     * Binds a set filter option to a checkbox or other form input.
     */
    function bindOption<T extends any>(option: Option, filter: string) {
        return {
            'onUpdate:modelValue': (checked: boolean | 'indeterminate') => {
                applyFilter(filter, option.value)
            },
            modelValue: option.active,
            value: option.value as T,
        }
    }

	// /**
	//  * Binds a match option to a checkbox.
	//  */
	// function bindMatch(name: string) {
	// 	return {
	// 		'onUpdate:modelValue': (checked: boolean | 'indeterminate') => {
	// 			//
	// 		},
	// 		modelValue: '',
	// 		value: key,
	// 	}
	// }

    /**
     * Binds a search input to a form input.
     */
    function bindSearch(options: VisitOptions = {}, searchOptions: SearchOptions = {}) {
        return {
            'onUpdate:modelValue': useDebounceFn((value: any) => {
                applySearch(value, options)
            }, searchOptions.debounce ?? 750),
            modelValue: refinements.value.search ?? ''
        }
    }

    return {
        refinements,
        filters,
        sorts,
        getSort,
        getFilter,
        getMatch,
        currentSort,
        currentFilters,
        currentSearches,
        isSorting,
        isFiltering,
        isSearching,
        applyFilter,
        applySort,
        clearFilter,
        reset,
        bindFilter,
        bindOption,
        // bindMatch,
        bindSearch,
    }
}
