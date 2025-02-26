<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { AppLayout } from '@/Layouts'
import { Card, CardContent } from '@/components/card'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu'
import { Ellipsis } from 'lucide-vue-next'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import { VisuallyHidden } from 'reka-ui'

defineOptions({ layout: AppLayout })

interface Props {
    organizations: any
    
}

const { organizations } = defineProps<Props>()


</script>

<template>
    <Head title="Organizations" />
    <Card>
        <div class="py-4 px-2 flex gap-x-2">
            <Input placeholder="Search" />
            <Button variant="outline">
                Actions
            </Button>
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline">
                        Sort
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        Name
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline">
                Filter
            </Button>
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline">
                        Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem v-for="column in organizations.columns" :key="column.name">
                        {{ column.label }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Table>
            <TableCaption class="sr-only">A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <div class="flex items-center">
                            <Checkbox />
                        </div>
                    </TableHead>
                    <TableHead v-for="column in organizations.columns" :key="column.name">
                        {{ column.label }}
                    </TableHead>
                    <TableHead>
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="row in organizations.records" :key="row.id">
                    <TableCell>
                        <div class="flex items-center">
                            <Checkbox />
                        </div>
                    </TableCell>
                    <TableCell v-for="column in organizations.columns" 
                        :key="column.name" 
                        class="font-medium"
                    >
                        {{ row[column.name] }}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu :modal="false">
                            <DropdownMenuTrigger>
                                <div class="flex items-center">
                                    <Ellipsis class="size-4" />
                                </div>
                                <VisuallyHidden>
                                    Toggle actions menu
                                </VisuallyHidden>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    {{ row.actions.length }}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Card>
</template>