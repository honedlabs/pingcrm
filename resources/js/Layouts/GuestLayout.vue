<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import BaseLayout from './BaseLayout.vue';
import { Card, CardContent, CardHeader } from '@/components/card';
import { Branding } from '@/components/branding';

interface Props {
    title: string
}

const { title } = defineProps<Props>()
</script>

<template>
    <BaseLayout>
        <Head :title />
        <div class="bg-primary min-h-screen flex flex-col items-center justify-center space-y-8">
            <Branding class="h-12 mx-auto fill-white"/>
            <Card class="w-full max-w-lg">
                <CardContent>
                    <slot />
                </CardContent>
            </Card>
        </div>
    </BaseLayout>
</template>
