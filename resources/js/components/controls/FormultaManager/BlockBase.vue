<script setup>
import useBlock from "./useBlock";

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
    clickable: {
        type: Boolean,
        default: true,
    },
    dropdownWidth: {
        type: String,
        default: "w-48",
    },
});

const { depthColor, isOpen, openBlock, closeBlock, blockState } =
    useBlock(props);

const onClickToggle = () => {
    if (!props.clickable) {
        return;
    }

    if (isOpen.value) {
        closeBlock();
    } else {
        openBlock();
    }
};
</script>

<template>
    <div
        class="block"
        :class="[`block--${depthColor}`, `block--${block.type}`]"
    >
        <div class="block__label">
            <div class="font-bold text-xs text-sky-900">
                <slot name="label"></slot>
            </div>
        </div>
        <div class="block__dropdown relative">
            <div
                class="block__toggle p-[5px] rounded flex items-center justify-center"
                :class="{
                    'cursor-pointer': clickable,
                }"
                @click="onClickToggle"
            >
                <slot name="toggle"></slot>
            </div>
            <div
                class="block__pane absolute"
                :class="[dropdownWidth, { hidden: !isOpen }]"
            >
                <div class="block__pane__inner shadow-lg p-3 bg-gray-100">
                    <slot name="pane"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
.block {
    &__pane {
        z-index: 2;
    }

    &--slate {
        .block {
            &__toggle {
                @apply border-slate-500 bg-slate-100;
            }
        }
    }

    &--blue {
        .block {
            &__toggle {
                @apply border-blue-500 bg-blue-100;
            }
        }
    }

    &--emerald {
        .block {
            &__toggle {
                @apply border-emerald-500 bg-emerald-100;
            }
        }
    }

    &--green {
        .block {
            &__toggle {
                @apply border-green-500 bg-green-100;
            }
        }
    }

    &--indigo {
        .block {
            &__toggle {
                @apply border-indigo-500 bg-indigo-100;
            }
        }
    }
}
</style>
