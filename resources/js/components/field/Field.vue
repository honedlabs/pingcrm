<script setup lang="ts">
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { Text } from '@/components/text';
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

const model = defineModel<string>({ required: true });
interface Props {
    label: string
    error?: string
}

const { label, error } = defineProps<Props>();

const id = useId();

</script>

<template>
    <div class="space-y-2">
        <Label :for="id">
            {{ label }}
        </Label>
        <slot>
            <Input v-model="model" v-bind="{ ...$attrs, id }"/>
        </slot>
        <Text v-if="error" variant="destructive">
            {{ error }}
        </Text>
    </div>
</template>