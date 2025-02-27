<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ConfigProvider } from 'reka-ui';
import { Toaster } from '@/components/sonner';
import { Modal } from '@honed/modal';
import { TooltipProvider } from '@/components/tooltip';

</script>

<template>
    <ConfigProvider>
        <TooltipProvider>
            <slot />
            <Modal />
            <Toaster />
        </TooltipProvider>
    </ConfigProvider>
</template>
