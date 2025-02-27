import { computed, reactive, ref, type Ref } from "vue"
import { router } from "@inertiajs/vue3"
import type { VisitOptions } from "@inertiajs/core"
import { toReactive } from "@vueuse/core"

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

export interface FilterRefiner extends Refiner {
    type: 'filter' | 'set' | 'date' | 'boolean' | string
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

export interface SearchRefiner extends Refiner { }

export interface Keys {
    sorts: string
    searches: string
    matches?: string
}

export interface Refine {
    sorts: SortRefiner[]
    filters: FilterRefiner[]
    search: string | null
    keys: Keys
    searches?: SearchRefiner[]
}

export interface DefaultOptions extends VisitOptions {
    /**
     * Whether the refinements should be applied immediately when changed
     * 
     * @default true
     */
    immediate?: boolean
}

export function useRefine<
    T extends object,
    K extends {
        [K in keyof T]: T[K] extends Refine ? K : never
    }[keyof T]
>(props: T, key: K, defaultOptions: VisitOptions = {}) {
    const refinements = computed(() => props[key] as Refine)

    const parameters = ref<Record<string, any>>({
        ...Object.fromEntries(
            refinements.value.filters.map(filter => [filter.name, filter.value])
        ),
        [refinements.value.keys.searches]: refinements.value.search
})

    // defaultOptions = {
    //     ...defaultOptions,
    //     only: [...((defaultOptions.only ?? []) as string[]), key.toString()]
    // }

    function getSort(name: string, direction: Direction = null): SortRefiner|undefined {
        return refinements.value.sorts.find(sort => sort.name === name && sort.direction === direction)
    }

    function getFilter(name: string): FilterRefiner|undefined {
        return refinements.value.filters.find(filter => filter.name === name)
    }

    function getMatch(name: string): SearchRefiner|undefined {
        return refinements.value.searches?.find(search => search.name === name)
    }

    function currentSort(): SortRefiner|undefined {
        return refinements.value.sorts.find(({ active }) => active)
    }

    function currentFilters(): FilterRefiner[] {
        return refinements.value.filters.filter(({ active }) => active)
    }

    function currentSearches(): SearchRefiner[] {
        return refinements.value.searches?.filter(({ active }) => active) ?? []
    }

    function isSorting(name?: string): boolean {
        if (name) {
            return currentSort()?.name === name
        }

        return !!currentSort()
    }

    function isFiltering(name?: string): boolean {
        if (name) {
            return currentFilters().some(filter => filter.name === name)
        }

        return !!currentFilters().length
    }

    function isSearching(name?: string): boolean {
        if (name) {
            return currentSearches()?.some(search => search.name === name)
        }

        return !!currentSearches()?.length
    }

    function applyFilter(name: string, value: any, options: VisitOptions = {}) {
        const filter = getFilter(name)

        if (!filter) {
            console.warn(`Filter [${name}] does not exist.`)
            return
        }

        if (['', null].includes(value)) {
            value = undefined
        }

        router.reload({
            ...options,
            data: {
                [filter.name]: value
            }
        })
    }

    function applySort(name: string, direction: Direction = null, options: VisitOptions = {}) {
        const sort = getSort(name, direction)

        if (!sort) {
            console.warn(`Sort [${name}] does not exist.`)
            return
        }

        router.reload({
            ...options,
            data: {
                [refinements.value.keys.sorts]: sort.next
            }
        })
    }

    function clearFilter(name: string, options: VisitOptions = {}) {
        applyFilter(name, undefined, options)
    }

    function clearSort(options: VisitOptions = {}) {
        router.reload({
            ...options,
            data: {
                [refinements.value.keys.sorts]: null
            }
        })
    }

    // function clearM

    function reset(options: VisitOptions = {}) {
        router.reload({
            ...options,
            data: {

            }
        })
    }

    // function bindFilter<T extends any>(name: string) {
    //     return {
    //         'onUpdate:modelValue': (value: any) => {
    //             applyFilter(name, value);
    //         },
    //         modelValue: filterValues.value[name],
    //     }
    // }

    return {
        /**
		 * Available filters.
		 */
        filters: reactive(refinements.value.filters.map(filter => ({
            ...filter,
            apply: (value: T, options: VisitOptions = {}) => applyFilter(filter.name, value, options),
            clear: (options: VisitOptions = {}) => clearFilter(filter.name, options),
            // bind: () => bindFilter(filter.name)
        }))),
        /**
		 * Available sorts.
		 */
        sorts: reactive(refinements.value.sorts.map(sort => ({
            ...sort,
            apply: (options: VisitOptions = {}) => applySort(sort.name, sort.direction, options),
            // clear: (options: VisitOptions = {}) => clearSort(sort.name, options),
        }))),
        /**
		 * Available matches.
		 */
        matches: null,
        /**
		 * Gets a sort by name.
		 */
        getSort,
        /**
		 * Gets a filter by name.
		 */
        getFilter,
        /**
		 * Gets a match by name.
		 */
        getMatch,
        /**
		 * The current sort.
		 */
        currentSort,
        /**
		 * The current filters.
		 */
        currentFilters,
        /**
		 * The current search matches.
		 */
        currentSearches,
        /**
         * Whether the given filter is currently active.
         */
        isFiltering,
        /**
         * Whether the given sort is currently active.
         */
        isSorting,
        /**
         * Whether the given match is currently active.
         */
        // isMatching,
        /**
         * Whether the search is currently active.
         */
        isSearching,
		/**
		 * Applies the given filter.
		 */
        applyFilter,
        /**
		 * Applies the given sort.
		 */
        applySort,
        /**
		 * Clear the given filter.
		 */
        clearFilter,
        /**
		 * Resets all filters, sorts, matches and search..
		 */
        reset,
        /**
		 * Binds a filter to a ref.
		 */
        // bindFilter,
        // bindMatch,
        // bindSearch,
    }
}
