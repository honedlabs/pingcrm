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
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/dropdown-menu'
import { 
    Icon,
    ChevronUp,
    ChevronDown, 
    ChevronLeft, 
    ChevronRight, 
    Ellipsis, 
    ChevronsUpDown,
    GripVertical
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
            <Input placeholder="Search" v-bind="table.bindSearch()" />
            <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" :disabled="!table.hasSelected">
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
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Countries
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent align="start">
                            <DropdownMenuCheckboxItem v-for="option in table.getFilter('country')?.options ?? []"
                                :key="option.value"
                                v-bind="table.bindOption(option, 'country')"
                            >
                                {{ option.label }}
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Countries
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent align="start">
                            <Input />
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
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
                        :model-value="column.active"
                        :disabled="! column.toggleable"
                        @click="column.toggleColumn()"
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
            <colgroup>
                <col class="w-10" span="1"/>
                <col v-for="col in table.headings" 
                    :key="col.name"
                    :class="col.class"
                />
                <col class="w-10" span="1"/>
            </colgroup>
            <TableHeader>
                <TableRow>
                    <TableHead class="w-10">
                        <div class="flex items-center">
                            <Checkbox v-bind="table.bindPage()"  />
                        </div>
                    </TableHead>
                    <TableHead v-for="col in table.headings" 
                        :key="col.name"
                    >
                        <span class="flex items-center gap-x-2">
                            {{ col.label }}
                            <button class="inline-flex justify-center items-center" v-if="col.sort" @click="col.applySort()">
                                <ChevronUp v-if="col.sort.direction === 'asc'" class="size-4" />
                                <ChevronDown v-else-if="col.sort.direction === 'desc'" class="size-4" />
                                <ChevronsUpDown v-else class="size-4" />
                            </button>
                        </span>
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
                            <Checkbox v-bind="row.bind()" />
                        </div>
                    </TableCell>
                    <TableCell v-for="column in table.headings" 
                        :key="column.name" 
                        :class="column.class"
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
                    <DropdownMenuItem v-for="item in table.rowsPerPage"
                        @click="item.apply()"
                    >
                        {{ item.value }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" 
                variant="outline" 
                :disabled="!table.paginator.prev"
            >
                <ChevronLeft class="size-4" />
                <VisuallyHidden>
                    Previous page
                </VisuallyHidden>
            </Button>
            <Button size="sm" 
                variant="outline" 
                :disabled="!table.paginator.next"
            >
                <ChevronRight class="size-4" />
                <VisuallyHidden>
                    Next page
                </VisuallyHidden>
            </Button>
        </Block>
        <!-- {{ table.paginator }} -->
    </Card>
</template>