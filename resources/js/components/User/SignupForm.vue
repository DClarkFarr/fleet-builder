<script setup>
import { reactive, ref, watch } from "vue";
import validator from "validator";
import apiClient from "../../services/apiClient";

import CircleNotchIcon from "~icons/fa-solid/circle-notch";

import useUserStore from "../../stores/userStore";

const userStore = useUserStore();

const form = reactive({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
});

const errors = reactive({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
});

const dirty = reactive({
    name: false,
    email: false,
    password: false,
    password_confirmation: false,
});

const isValid = ref(false);
const isSubmitting = ref(false);

const errorMessage = ref("");

const validate = () => {
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

    try {
        const res = await apiClient.post("user/register", form);

        userStore.setUser(user);

        router.push({
            name: "home",
        });
    } catch (error) {
        if (error.response?.data?.errors) {
            Object.keys(error.response.data.errors).forEach((key) => {
                errors[key] = error.response.data.errors[key][0];
            });
        } else {
            errorMessage.value = error.response?.data?.message || error.message;
        }
    }
    isSubmitting.value = false;
};
</script>

<template>
    <form action="" @submit.prevent="onSubmit">
        <div class="form-group">
            <label> Name </label>
            <input type="text" v-model="form.name" class="form-control" />

            <p class="text-red-600" v-if="dirty.name && errors.name">
                {{ errors.name }}
            </p>
        </div>
        <div class="form-group">
            <label> Email </label>
            <input type="email" v-model="form.email" class="form-control" />

            <p class="text-red-600" v-if="dirty.email && errors.email">
                {{ errors.email }}
            </p>
        </div>
        <div class="form-group">
            <label> Password </label>
            <input
                type="password"
                v-model="form.password"
                class="form-control"
            />
            <p class="text-red-600" v-if="dirty.password && errors.password">
                {{ errors.password }}
            </p>
        </div>
        <div class="form-group">
            <label> Confirm Password </label>
            <input
                type="password"
                v-model="form.password_confirmation"
                class="form-control"
            />
            <p
                class="text-red-600"
                v-if="
                    dirty.password_confirmation && errors.password_confirmation
                "
            >
                {{ errors.password_confirmation }}
            </p>
        </div>
        <div class="form-control" v-if="errorMessage.length">
            <p>
                <span class="text-red-600">
                    {{ errorMessage }}
                </span>
            </p>
        </div>
        <div class="form-group">
            <button
                type="submit"
                :disabled="!isValid || isSubmitting"
                class="btn bg-sky-600 hover:bg-sky-800"
            >
                <template v-if="isSubmitting">
                    <CircleNotchIcon class="animate-spin" />
                </template>
                <template v-else> Create Account </template>
            </button>
        </div>

        <div class="form-group text-center">
            <router-link class="text-sky-600" :to="{ name: 'user.login' }">
                Login
            </router-link>
        </div>
    </form>
</template>
