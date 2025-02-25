<script setup lang="ts">
import { GuestLayout } from '@/Layouts';
import { Link, useForm } from '@inertiajs/vue3';
import { Button } from '@/components/button';
import { Field } from '@/components/field';
import { Form } from '@/components/form';
import { Checkbox } from '@/components/checkbox';
import { Block } from '@/components/block';
import { Label } from '@/components/label';

defineProps<{
    canResetPassword?: boolean;
    status?: string;
}>();

const form = useForm({
    email: 'johndoe@example.com',
    password: 'secret',
    remember: false,
});

const onSubmit = () => {
    form.post(route('login'), {
        onFinish: () => {
            form.reset('password');
        },
    });
};
</script>

<template>
    <GuestLayout title="Log in">
        <Form @submit="onSubmit">
            <Field label="Email" 
                v-model="form.email"
                type="email"
                :error="form.errors.email" 
                autofocus
                autocomplete="username"
                placeholder="your@email.com"
            />
            <Field label="Password" 
                v-model="form.password"
                type="password"
                :error="form.errors.password" 
                autocomplete="current-password"
                placeholder="Enter your password..."
            />
            <Block as="label" variant="inline">
                <Checkbox name="remember" v-model="form.remember" />
                <Label as="span">Remember me</Label>
            </Block>

            <div class="mt-4 flex items-center justify-end">
                <Link
                    v-if="canResetPassword"
                    :href="route('password.request')"
                    class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    Forgot your password?
                </Link>

                <Button
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Log in
                </Button>
            </div>
        </Form>
    </GuestLayout>
</template>
