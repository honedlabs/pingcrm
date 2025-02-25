<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ConfigProvider } from 'reka-ui';
import { Toaster } from '@/components/sonner';
</script>

<template>
    <ConfigProvider>
        <slot />
        <Toaster />
    </ConfigProvider>
</template>
