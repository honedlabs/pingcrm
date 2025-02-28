import type { Method } from '@inertiajs/core'

export type Identifier = string | number

export interface Route {
    href: string
    method: Method
}

export type ActionType = 'inline' | 'page' | 'bulk'

export interface Confirm {
    title: string
    description: string
}

export interface BaseAction {
    name: string
    label: string
    type: ActionType
    action?: boolean
    extra?: Record<string, unknown>
    icon?: string
    confirm?: Confirm
    route?: Route
}

export interface InlineAction extends BaseAction {
    type: 'inline'
    default: boolean
}

export interface BulkAction extends BaseAction {
    type: 'bulk'
    keepSelected: boolean
}

export interface PageAction extends BaseAction {
    type: 'page'
}
