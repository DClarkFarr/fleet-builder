<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import ToggleSwitch from "../controls/ToggleSwitch.vue";

import {
    getShipChipsCount,
    getUserShipColumnsReferenced,
} from "../../methods/ship";
import { useToast } from "vue-toastification";
import DataService from "../../services/DataService";

import DropZoneInline from "../controls/DropZoneInline.vue";

import useTesseract from "../../hooks/useTesseract";

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
    onDelete: {
        type: Function,
        default: null,
    },
    onUpdate: {
        type: Function,
        default: null,
    },
});

const toast = useToast();

const isSaving = ref(false);

const { getWorker } = useTesseract();

const form = reactive({
    name: "",
    chip_level: 0,
    visible: true,
    level: 1,
});

const onSubmit = async () => {
    isSaving.value = true;

    try {
        props.onSave({
            ...form,
            id_ship: props.ship.id_ship,
            id_user_ship: props.userShip?.id_user_ship,
            columns: columnValues.value,
        });
    } catch (err) {
        toast.error(error.response?.data?.message || err.message);
    }

    isSaving.value = false;
};

const onClickDelete = async (userShip) => {
    if (!props.onDelete) {
        return false;
    }
    isSaving.value = true;

    try {
        props.onDelete(userShip);
    } catch (err) {
        toast.error(error.response?.data?.message || err.message);
    }

    isSaving.value = false;
};

const resetForm = () => {
    if (props.userShip) {
        form.name = props.userShip.name;
        form.chip_level = props.userShip.chip_level;
        form.visible = props.userShip.visible;
        form.level = props.userShip.level;
    } else {
        form.name = "";
        form.chip_level = 0;
        form.visible = true;
        form.level = 1;
    }
};

const onFileUploaded = async ({ url: stat_img }) => {
    if (typeof props.onUpdate === "function") {
        await props.onUpdate(props.userShip.id_user_ship, {
            stat_img,
        });
    }

    const worker = await getWorker();

    try {
        // const { data } = await worker.detect(stat_img);
        const { data, ...xs } = await worker.recognize(stat_img, {
            rectangle: { top: 103, left: 32, width: 176, height: 520 },
        });
    } catch (err) {
        console.error("Caught error parsing image", err);
    }
};

const onFileRemoved = async () => {
    if (typeof props.onUpdate === "function") {
        await props.onUpdate(props.userShip.id_user_ship, {
            stat_img: null,
        });
    }
};

const chipCount = computed(() => {
    return getShipChipsCount(props.ship);
});

const columnsReferenced = computed(() => {
    const columnNames = DataService.getShipColumns();
    const columns = getUserShipColumnsReferenced(props.userShip);

    return columns.map((col) => {
        return columnNames.find((c) => c.slug === col);
    });
});

const columnValues = computed(() => {
    const obj = columnsReferenced.value.reduce((acc, { slug }) => {
        acc[slug] = props.userShip.columns?.[slug] || 0;
        return acc;
    }, {});

    return obj;
});

const uploadUrl = computed(() => {
    if (!props.userShip) {
        return "";
    }
    return `${window.location.origin}/api/user/ships/${props.userShip.id_user_ship}/upload`;
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
        <div class="flex gap-x-4 cols-2">
            <div class="form-group w-1/2">
                <label>Chip Level</label>
                <div class="chips flex gap-x-1 py-2">
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
            <div class="form-group w-1/2">
                <label>Level</label>
                <input type="number" class="input" v-model="form.level" />
            </div>
        </div>
        <div class="form-group" v-if="userShip">
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
        <div v-if="columnsReferenced.length > 0" class="py-4">
            <hr />
            <div class="py-6">
                <h3 class="text-xl font-bold mb-2">
                    Columns Referenced (via abilities)
                </h3>
                <div
                    class="form-group pt-4"
                    v-for="column in columnsReferenced"
                    :key="column.slug"
                >
                    <label>{{ column.name }}</label>
                    <input
                        type="number"
                        class="input"
                        v-model="columnValues[column.slug]"
                    />
                </div>
            </div>
            <hr />
        </div>

        <div class="py-8" v-if="userShip">
            <h2 class="text-white font-semibold text-lg">Ship Stats</h2>
            <div class="user-ship-form__stats">
                <DropZoneInline
                    :url="uploadUrl"
                    :img="userShip.stat_img"
                    :data="{ type: 'stat_img' }"
                    @uploaded="onFileUploaded"
                    @removed="onFileRemoved"
                />
            </div>
        </div>
        <div class="form-group pt-4 flex gap-x-4 justify-between">
            <div>
                <button class="btn btn-blue" type="submit" :disabled="isSaving">
                    <template v-if="isSaving">
                        <CircleNotchIcon class="animate-spin" />
                    </template>
                    <template v-else>
                        {{ userShip ? "Update Ship" : "Add Ship" }}
                    </template>
                </button>
            </div>
            <div v-if="userShip && onDelete">
                <button
                    class="btn btn-red"
                    type="submit"
                    @click.prevent="onClickDelete(userShip)"
                    :disabled="isSaving"
                >
                    <template v-if="isSaving">
                        <CircleNotchIcon class="animate-spin" />
                    </template>
                    <template v-else> Delete </template>
                </button>
            </div>
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
