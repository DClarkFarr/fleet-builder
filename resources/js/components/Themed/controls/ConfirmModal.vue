<script>
import { $vfm } from "vue-final-modal";
import ContentBox from "../ContentBox.vue";

export const showConfirmModal = (options) => {
    $vfm.show({
        component: "confirm-modal",
        bind: {
            title: options.title,
            message: options.message,
            onConfirm: options.onConfirm,
            onCancel: options.onCancel,
            confirmBtnClass: options.confirmBtnClass,
        },
    });
};
</script>
<script setup>
const props = defineProps({
    onConfirm: {
        type: Function,
        required: true,
    },
    onCancel: {
        type: Function,
        default: null,
    },
    title: {
        type: String,
        default: false,
    },
    message: {
        type: String,
        default: false,
    },
    confirmBtnClass: {
        type: String,
        default: "btn-red",
    },
});

const onClickCancel = (close) => {
    if (typeof props.onCancel === "function") {
        props.onCancel();
    }
    close();
};

const onClickConfirm = (close) => {
    if (typeof props.onConfirm === "function") {
        props.onConfirm();
    }
    close();
};
</script>

<template>
    <vue-final-modal
        name="confirm-modal"
        v-slot="{ close }"
        classes="modal-container"
        content-class="w-full modal-content--xl"
    >
        <ContentBox class="w-full text-modal-text" bg-class="custom-bg">
            <div class="modal__title text-2xl font-medium mb-8">
                <slot name="title">
                    {{ title }}
                </slot>
            </div>

            <div class="modal__content p-6 mb-6">
                <slot> {{ message }} </slot>
            </div>

            <div class="modal__footer flex justify-end items-center gap-x-3">
                <slot name="buttons">
                    <button class="btn btn-blue" @click="onClickCancel(close)">
                        Cancel
                    </button>
                    <button
                        :class="['btn', confirmBtnClass]"
                        @click="onClickConfirm(close)"
                    >
                        Confirm
                    </button>
                </slot>
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less" scoped>
.custom-bg {
    background: rgba(87, 122, 150, 0.5);
}

.modal {
    &__content {
        background: rgba(79, 117, 157, 0.35);
    }
}
</style>
