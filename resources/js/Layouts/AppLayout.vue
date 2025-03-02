<script setup lang="ts">
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import BaseLayout from './BaseLayout.vue'
import { Branding } from '@/components/branding';
import { 
    SidebarProvider, 
    Sidebar, 
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem, 
    SidebarMenuButton, 
    SidebarHeader
} from '@/components/sidebar';
import { useNav } from '@honed/nav';

const nav = useNav('app');

</script>

<template>
    <BaseLayout>
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader class="bg-indigo-800">
                    <Link href="/">
                        <Branding class="h-6"/>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup v-for="group in nav" :key="group.label">
                        <SidebarGroupLabel>
                            {{ group.label }}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem v-for="item in group.items" :key="item.name">
                                    <SidebarMenuButton as-child>
                                        <Link :href="item.href">
                                            {{ item.label }}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <div class="w-full">
                <header>

                </header>
                <main class="px-8 py-4">
                    {{ nav }}
                    <slot />
                </main>
            </div>
        </SidebarProvider>

    </BaseLayout>
</template>
