<script setup>
import LockIcon from "~icons/fa-solid/unlock-alt";

import { computed } from "vue";

const props = defineProps({
    location: {
        type: String,
        required: true,
    },
    locationName: {
        type: String,
        required: true,
    },
    fleet: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["select"]);

const onSelectFleet = () => {
    emit(
        "select",
        { slug: props.location, name: props.locationName },
        props.fleet
    );
};

const isEmpty = computed(() => {
    return !props.fleet;
});
</script>

<template>
    <div
        class="fleet-slot"
        :class="{
            'fleet-slot--busy': !isEmpty,
            'fleet-slot--empty': isEmpty,
        }"
    >
        <div
            class="fleet-slot__info p-4 rounded min-h-[350px] mb-4 border border-dark-border-start"
        >
            next text
        </div>
        <div
            class="fleet-slot__bottom flex flex-col items-center"
            @click="onSelectFleet"
        >
            <div class="fleet-slot__button">
                <template v-if="!isEmpty">
                    <img src="/images/fleet-icon.png" />
                </template>
                <template v-else>
                    <LockIcon />
                </template>
            </div>
            <div class="sleet-slot__label text-xs text-white">
                {{ locationName }}
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.fleet-slot {
    &__info {
        background: linear-gradient(
            180deg,
            rgba(1, 1, 6, 0.64),
            rgba(0, 0, 0, 0.25)
        );

        box-shadow: 0 0 3px 0 #517090;
    }

    &__button {
        @apply flex items-center justify-center cursor-pointer;

        background-image: url("/resources/images/hexagon-md.png");
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;

        height: 50px;
        width: 50px;

        .fleet-slot--empty & {
            color: #485562;

            &:hover {
                color: #8096ac;
            }
        }

        .fleet-slot--busy & {
            img {
                width: 25px;
            }
        }
    }
}
</style>
