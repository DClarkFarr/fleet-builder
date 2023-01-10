<script setup>
import { reactive, ref, watch } from "vue";
import validator from "validator";
import apiClient from "../../services/apiClient";

import CircleNotchIcon from "~icons/fa-solid/circle-notch";

import useUserStore from "../../stores/userStore";

const userStore = useUserStore();

const form = reactive({
    alliance: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
});

const errors = reactive({
    alliance: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
});

const dirty = reactive({
    alliance: false,
    name: false,
    email: false,
    password: false,
    password_confirmation: false,
});

const isValid = ref(false);
const isSubmitting = ref(false);

const errorMessage = ref("");

const validate = () => {
    if (form.alliance) {
        dirty.alliance = true;
        errors.alliance = "";
    } else {
        errors.alliance =
            "You'll need to have an alliance name, to share with others";
    }

    if (form.email) {
        dirty.email = true;
        errors.email = validator.isEmail(form.email) ? "" : "Invalid email";
    } else {
        errors.email = "Email is required";
    }

    if (form.password) {
        dirty.password = true;
        errors.password = validator.isLength(form.password, { min: 6 })
            ? ""
            : "Password must be at least 6 characters";
    } else {
        errors.password = "Password is required";
    }

    if (form.name) {
        dirty.name = true;
        errors.name = validator.isLength(form.name, { min: 3 })
            ? ""
            : "Name must be at least 3 characters";
    } else {
        errors.name = "Name is required";
    }

    if (form.password_confirmation) {
        dirty.password_confirmation = true;
        errors.password_confirmation =
            form.password === form.password_confirmation
                ? ""
                : "Password confirmation must match password";
    } else {
        errors.password_confirmation = "Password is required";
    }

    isValid.value = !Object.values(errors).some((error) => error);
};

watch(form, () => {
    validate();
});

const onSubmit = async () => {
    isSubmitting.value = true;
    errorMessage.value = "";
    errors.email = "";
    errors.password = "";
    errors.alliance = "";

    try {
        const res = await apiClient.post("user/register", form);

        userStore.setUser(res.data.user);

        window.location.href = "/builder";
    } catch (err) {
        if (err.response?.data?.errors) {
            Object.keys(err.response.data.errors).forEach((key) => {
                errors[key] = err.response.data.errors[key][0];
            });
        } else {
            errorMessage.value = err.response?.data?.message || err.message;
        }
    }
    isSubmitting.value = false;
};
</script>

<template>
    <form action="" @submit.prevent="onSubmit">
        <div class="form-group">
            <input
                type="text"
                v-model="form.alliance"
                class="input"
                placeholder="Alliance Name"
            />

            <p
                class="text-btn-red-text bg-black/25 p-2"
                v-if="dirty.alliance && errors.alliance"
            >
                {{ errors.alliance }}
            </p>
        </div>

        <div class="form-group">
            <input
                type="text"
                v-model="form.name"
                class="input"
                placeholder="Fleet Name"
            />

            <p
                class="text-btn-red-text bg-black/25 p-2"
                v-if="dirty.name && errors.name"
            >
                {{ errors.name }}
            </p>
        </div>
        <div class="form-group">
            <input
                type="email"
                v-model="form.email"
                class="input"
                placeholder="Email address"
            />

            <p
                class="text-btn-red-text bg-black/25 p-2"
                v-if="dirty.email && errors.email"
            >
                {{ errors.email }}
            </p>
        </div>
        <div class="form-group">
            <input
                type="password"
                v-model="form.password"
                class="input"
                placeholder="Password"
            />
            <p
                class="text-btn-red-text bg-black/25 p-1"
                v-if="dirty.password && errors.password"
            >
                {{ errors.password }}
            </p>
        </div>
        <div class="form-group">
            <input
                type="password"
                v-model="form.password_confirmation"
                class="input"
                placeholder="Confirm Password"
            />
            <p
                class="text-btn-red-text bg-black/25 p-2"
                v-if="
                    dirty.password_confirmation && errors.password_confirmation
                "
            >
                {{ errors.password_confirmation }}
            </p>
        </div>
        <div class="input" v-if="errorMessage.length">
            <p>
                <span class="text-btn-red-text bg-black/25 p-2">
                    {{ errorMessage }}
                </span>
            </p>
        </div>
        <div class="form-group mb-8">
            <button
                type="submit"
                :disabled="!isValid || isSubmitting"
                class="btn btn-blue block w-full"
            >
                <template v-if="isSubmitting">
                    <CircleNotchIcon class="animate-spin" />
                </template>
                <template v-else> Create Account </template>
            </button>
        </div>

        <div class="form-group text-center">
            <router-link class="text-sky-600" :to="{ name: 'login' }">
                Login
            </router-link>
        </div>
    </form>
</template>
