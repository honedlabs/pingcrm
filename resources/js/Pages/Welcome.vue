<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';

interface Props {
    users: any;
}

const props = defineProps<Props>();

const table = props.users
</script>

<template>
    <Head title="Welcome" />
    <div class="bg-gray-100 text-black/50 dark:bg-black dark:text-white/50">
        <div class="px-16 py-8 min-h-screen">
            <table>
                <tr>
                    <thead v-for="column in table.columns" :key="column.key">
                        {{ column.label }}
                    </thead>
                </tr>
                <tr v-for="record in table.records" :key="record.id">
                    <td v-for="column in table.columns" :key="column.key">
                        {{ record }}
                    </td>
                </tr>
            </table>
            <!-- {{ props.users }} -->
        </div>
    </div>
</template>
