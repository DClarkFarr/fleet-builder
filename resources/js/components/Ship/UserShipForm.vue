<script setup>
import { ref, reactive, computed, watch } from "vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import ToggleSwitch from "../controls/ToggleSwitch.vue";

import { getShipChipsCount } from "../../methods/ship";

const props = defineProps({
    ship: {
        type: Object,
        required: true,
    },
    userShip: {
        type: Object,
        default: null,
    },
    onSave: {
        type: Function,
        required: true,
    },
});

const isSaving = ref(false);

const form = reactive({
    name: "",
    chip_level: 0,
    visible: true,
});

const onSubmit = async () => {
    isSaving.value = true;

    try {
        props.onSave({
            ...form,
            id_ship: props.ship.id_ship,
            id_user_ship: props.userShip?.id_user_ship,
        });
    } catch (err) {}

    isSaving.value = false;
};

const resetForm = () => {
    if (props.userShip) {
        form.name = props.userShip.name;
        form.chip_level = props.userShip.chip_level;
        form.visible = props.userShip.visible;
    } else {
        form.name = "";
        form.chip_level = 0;
        form.visible = true;
    }
};
const chipCount = computed(() => {
    return getShipChipsCount(props.ship);
});

watch(
    () => props.userShip,
    () => {
        resetForm();
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <form action="" class="user-ship-form" @submit.prevent="onSubmit">
        <div class="form-group">
            <label>Nickname (optional identifier for your sanity)</label>
            <input
                type="text"
                class="input"
                :placeholder="`Example: Best ${ship.name}`"
                v-model="form.name"
            />
        </div>
        <div class="form-group">
            <label>Chip Level</label>
            <div class="chips flex gap-x-1">
                <div
                    class="chip cursor-pointer"
                    v-for="i of chipCount + 1"
                    :key="i"
                    :class="{ 'chip--unlocked': i - 1 <= form.chip_level }"
                    @click="form.chip_level = i - 1"
                >
                    {{ i - 1 }}
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>Visibility</label>
            <div>
                <ToggleSwitch
                    v-model="form.visible"
                    :label="
                        form.visible
                            ? `Visible to workshops`
                            : `Hidden from workshops`
                    "
                />
            </div>
        </div>
        <div class="form-group pt-4">
            <button class="btn btn-blue" type="submit" :disabled="isSaving">
                <template v-if="isSaving">
                    <CircleNotchIcon class="animate-spin" />
                </template>
                <template v-else>
                    {{ userShip ? "Update Ship" : "Add Ship" }}
                </template>
            </button>
        </div>
    </form>
</template>

<style lang="less" scoped>
.chip {
    @apply leading-none bg-box-gray text-box-gray-text hover:bg-btn-yellow-border hover:text-btn-yellow-bg;

    padding: 2px 5px;

    &--unlocked {
        @apply bg-weapon-btn-border-2-hover text-btn-yellow-bg;
    }
}
</style>
