import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";
import { type PageProps } from "@inertiajs/core";

declare module '@inertiajs/core' {
    interface PageProps {
        nav: NavProps;
    }
}

export interface NavBase {
    label: string
    icon?: string
}

export interface NavItem extends NavBase {
    href: string
    active: boolean
}

type NavOption = NavGroup | NavItem

export interface NavGroup extends NavBase {
    items: NavOption[]
}

export type NavProps = Record<string, NavOption>

const page = usePage<PageProps>();

export const useNav = (group?: keyof NavProps) => {
    const nav = computed(() => page.props.nav);

    if (group) {
        return nav.value[group];
    }

    return nav.value;
}