<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { AppLayout } from '@/Layouts'
import { Card } from '@/components/card'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/table'

defineOptions({ layout: AppLayout })

interface Props {
    organizations: any
    
}

const { organizations } = defineProps<Props>()


</script>

<template>
    <Head title="Organizations" />
    <Card>
        <Table>
            <TableCaption class="sr-only">A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead class="w-[100px]">
                        Invoice
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead class="text-right">
                        Amount
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <!-- <TableRow v-for="invoice in invoices" :key="invoice.invoice">
                    <TableCell class="font-medium">
                        {{ invoice.invoice }}
                    </TableCell>
                    <TableCell>{{ invoice.paymentStatus }}</TableCell>
                    <TableCell>{{ invoice.paymentMethod }}</TableCell>
                    <TableCell class="text-right">
                        {{ invoice.totalAmount }}
                    </TableCell>
                </TableRow> -->
            </TableBody>
        </Table>
    </Card>
</template>