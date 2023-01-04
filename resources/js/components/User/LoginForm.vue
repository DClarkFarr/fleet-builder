<script setup>
import { reactive, ref, watch } from "vue";
import validator from "validator";
import apiClient from "../../services/apiClient";

import CircleNotchIcon from "~icons/fa-solid/circle-notch";

import useUserStore from "../../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();

const router = useRouter();

const form = reactive({
    email: "",
    password: "",
});

const errors = reactive({
    email: "",
    password: "",
});

const dirty = reactive({
    email: false,
    password: false,
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
        const res = await apiClient.post("user/login", form);

        userStore.setUser(res.data.user);

        router.push({
            name: "home",
        });
    } catch (error) {
        console.log(error);
        if (error.response?.data?.errors) {
            console.log("got errors", error.response.data.errors);
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
            <label> Email </label>
            <input
                type="email"
                v-model="form.email"
                class="form-control"
                name="email"
            />

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
                name="password"
            />
            <p class="text-red-600" v-if="dirty.password && errors.password">
                {{ errors.password }}
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
                <template v-else> Login </template>
            </button>
        </div>

        <div class="form-group text-center">
            <router-link class="text-sky-600" :to="{ name: 'user.signup' }">
                Create Account
            </router-link>
        </div>
    </form>
</template>
