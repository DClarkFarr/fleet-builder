<script setup>
import { computed } from "vue";

import IconCaret from "~icons/fa-solid/caret-down";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        default: "",
        required: true,
    },
});

const emit = defineEmits(["update:modelValue"]);

const open = () => {
    emit("update:modelValue", props.name);
};

const close = () => {
    emit("update:modelValue", "");
};

const toggle = () => {
    if (isOpen.value) {
        close();
    } else {
        open();
    }
};

const isOpen = computed(() => props.modelValue === props.name);
</script>

<template>
    <div
        class="accordion mb-4"
        :class="{
            'accordion--open': isOpen,
        }"
    >
        <div class="accordion__header mb-2">
            <slot name="header" v-bind="{ toggle, open, close, isOpen }">
                <div
                    class="flex w-full py-2 px-4 border border-dark-border-start rounded cursor-pointer text-text-blue accordion__toggle"
                    @click="toggle"
                >
                    <div>
                        <slot name="title"> Title here </slot>
                    </div>
                    <div class="ml-auto">
                        <IconCaret :class="{ 'rotate-90': !isOpen }" />
                    </div>
                </div>
            </slot>
        </div>
        <div class="accordion__body p-4" v-if="isOpen">
            <div>
                <slot
                    name="body"
                    v-bind="{ toggle, open, close, isOpen }"
                ></slot>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.accordion {
    &__toggle {
        background: rgba(0, 0, 0, 0.4);

        &:hover {
            background: rgba(0, 0, 0, 0.6);
        }
    }

    &__body {
        background-color: rgba(105, 115, 129, 0.25);
    }
}
</style>
