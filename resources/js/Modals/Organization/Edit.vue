<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { useModal } from '@honed/modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/dialog'
import { Text } from "@/components/text";
import { Button } from '@/components/button'

interface Props {
    organization: any
}

const { organization } = defineProps<Props>()

const { show, close, redirect } = useModal();

</script>

<template>
    <Head title="" />
    <Dialog :open="show" @update:open="close">
        <DialogContent @after-leave="redirect">
            <DialogHeader :close>
                <DialogTitle>
                    Edit organization
                </DialogTitle>
            </DialogHeader>
            //
            <DialogFooter>
                <Button variant="ghost" @click="close">
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>