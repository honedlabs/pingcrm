<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { AppLayout } from '@/Layouts'
import { Card, CardContent } from '@/components/card'
import { Table, 
    TableCaption, 
    TableHeader, 
    TableRow, 
    TableHead, 
    TableBody, 
    TableCell 
} from '@/components/table'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuCheckboxItem 
} from '@/components/dropdown-menu'
import { 
    Icon,
    ChevronDown, 
    ChevronLeft, 
    ChevronRight, 
    Ellipsis 
} from 'lucide-vue-next'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import { Primitive, VisuallyHidden } from 'reka-ui'
import { useTable } from '@/table'
import { ref } from 'vue'
import { Label } from '@/components/label'
import { Block } from '@/components/block'

defineOptions({ layout: AppLayout })

interface Props {
    organizations: any
    
}

const props = defineProps<Props>()

const table = useTable(props, 'organizations')

</script>

<template>
    <Head title="Organizations" />
    <Card>
        <div class="py-4 px-2 flex gap-x-2">
            <Input placeholder="Search" />
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" :disabled="!table.bulk.hasSelected">
                        Actions
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem v-for="action in table.bulkActions"
                        @click="action.execute()"
                    >
                        {{ action.label }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline">
                        Sort
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem v-for="sort in table.sorts"
                        @click="sort.apply"
                    >
                        {{ sort.label }} {{ sort.active }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline">
                        Filter
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem v-for="filter in table.filters"
                        @click="filter.apply"
                    >
                        {{ filter.label }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline">
                        Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem v-for="column in table.columns"
                        :key="column.name"
                        :model-value="column.active"
                        :disabled="! column.toggle"
                    >
                        {{ column.label }}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Table>
            <TableCaption class="sr-only">
                A list of your organizations.
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <div class="flex items-center">
                            <Checkbox v-bind="table.bulk.bindAll()"  />
                        </div>
                    </TableHead>
                    <TableHead v-for="column in table.headings" :key="column.name">
                        {{ column.label }}
                    </TableHead>
                    <TableHead>
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="row in table.records" 
                    :key="row.id"
                    @click="row.default()"
                >
                    <TableCell @click.stop>
                        <div class="flex items-center">
                            <Checkbox v-bind="table.bulk.bind(row.id)" />
                        </div>
                    </TableCell>
                    <TableCell v-for="column in table.headings" 
                        :key="column.name" 
                        class="font-medium"
                    >
                        {{ row[column.name] }}
                    </TableCell>
                    <TableCell @click.stop>
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
                                <DropdownMenuItem v-for="action in row.actions"
                                    @click="action.execute()"
                                >
                                    <!-- <component :is="action.icon" /> -->
                                    {{ action.label }}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <Block variant="inline">
            <Label for="rows-per-page">
                Rows per page
            </Label>
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" id="rows-per-page" class="inline-flex">
                        {{ table.currentPage?.value }}
                        <ChevronDown class="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem v-for="item in table.pages"
                        @click="item.apply()"
                    >
                        {{ item.value }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" 
                variant="outline" 
                :as="Link"
                :href="table.paginator.prev"
                :disabled="!table.paginator.prev"
            >
                <ChevronLeft class="size-4" />
                <VisuallyHidden>
                    Previous page
                </VisuallyHidden>
            </Button>
            <Button size="sm" 
                variant="outline" 
                :as="Link"
                :href="table.paginator.next"
                :disabled="!table.paginator.next"
            >
                <ChevronRight class="size-4" />
                <VisuallyHidden>
                    Next page
                </VisuallyHidden>
            </Button>
            {{ !table.paginator.prev }}
        </Block>
    </Card>
</template>