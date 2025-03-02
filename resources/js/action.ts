import type { Method, VisitOptions } from '@inertiajs/core'
import { router } from '@inertiajs/vue3'

export type Identifier = string | number

interface Route {
    href: string
    method: Method
}

export type ActionType = 'inline' | 'page' | 'bulk'

export interface Confirm {
    title: string
    description: string
}

export interface Action {
    name: string
    label: string
    type: ActionType
    action?: boolean
    extra?: Record<string, unknown>
    icon?: string
    confirm?: Confirm
    route?: Route
}

export interface InlineAction extends Action {
    type: 'inline'
    default: boolean
}

export interface BulkAction extends Action {
    type: 'bulk'
    keepSelected: boolean
}

export interface PageAction extends Action {
    type: 'page'
}

export interface InlineActionData extends Record<string, any> {
    id: Identifier
}

export interface BulkActionData extends Record<string, any> {
    all: boolean
    only: Identifier[]
    except: Identifier[]
}

/**
 * Execute the action.
 */
export function executeAction<
    T extends ActionType = any
> (
    action: T extends 'inline' 
        ? InlineAction 
        : T extends 'bulk' 
            ? BulkAction 
            : T extends 'page' 
                ? PageAction 
                : Action, 
    endpoint?: string, 
    data: T extends 'inline' 
        ? InlineActionData
        : T extends 'bulk' 
            ? BulkActionData
            : Record<string, any> = {} as any,
    options: VisitOptions = {}
) {
    if (action.route) {
        router.visit(action.route.href, {
            ...options,
            method: action.route.method,
        })

        return true
    }

    if (action.action && endpoint) {
        router.post(endpoint, {
            ...data,
            name: action.name,
            type: action.type,
        }, options)

        return true
    }

    return false
}
