<script setup lang="ts">
// import Checkbox from '@/Components/Checkbox.vue';
import { GuestLayout } from '@/Layouts';
// import InputError from '@/Components/InputError.vue';
// import InputLabel from '@/Components/InputLabel.vue';
// import PrimaryButton from '@/Components/PrimaryButton.vue';
// import TextInput from '@/Components/TextInput.vue';
import { Link, useForm } from '@inertiajs/vue3';
import { Button } from '@/components/button';
import { Field } from '@/components/field';
import { Form } from '@/components/form';
// import {}

defineProps<{
    canResetPassword?: boolean;
    status?: string;
}>();

const form = useForm({
    email: '',
    password: '',
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

            <div class="mt-4 block">
                <label class="flex items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <span class="ms-2 text-sm text-gray-600 dark:text-gray-400"
                        >Remember me</span
                    >
                </label>
            </div>

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
