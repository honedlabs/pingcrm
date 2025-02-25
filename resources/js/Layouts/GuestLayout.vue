<script setup lang="ts">
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
import BaseLayout from './BaseLayout.vue';
import { Card, CardContent, CardHeader } from '@/components/card';
import { Branding } from '@/components/branding';
</script>

<template>
    <BaseLayout>
        <div class="bg-primary min-h-screen flex flex-col items-center justify-center space-y-8">
            <Branding class="h-12 mx-auto fill-white"/>
            <Card class="w-full max-w-xl">
                <CardContent>
                    <CardHeader>
                    </CardHeader>
                    <slot />
                </CardContent>
            </Card>
        </div>
    </BaseLayout>
</template>
