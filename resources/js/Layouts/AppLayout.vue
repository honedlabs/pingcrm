<script setup lang="ts">
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import BaseLayout from './BaseLayout.vue'
import { 
    SidebarProvider, 
    Sidebar, 
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem, 
    SidebarMenuButton 
} from '@/components/sidebar';

const items = [
    {
        title: "Home",
        href: "#",
    },
    {
        title: "Inbox",
        href: "#",
    },
    {
        title: "Calendar",
        href: "#",
    },
    {
        title: "Search",
        href: "#",
    },
    {
        title: "Settings",
        href: "#",
    },
];
</script>

<template>
    <BaseLayout>
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Pages
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem v-for="item in items" :key="item.name">
                                    <SidebarMenuButton as-child>
                                        <Link :href="item.href">
                                            {{ item.title }}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main>
                <slot />
            </main>
        </SidebarProvider>

    </BaseLayout>
</template>
