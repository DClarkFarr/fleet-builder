<script setup>
import EditIcon from "~icons/fa-solid/pencil-alt";

const props = defineProps({
    abilities: {
        type: Array,
        default: () => [],
    },
    location: {
        type: String,
        required: true,
    },
    locationName: {
        type: String,
        required: true,
    },
    onSave: {
        type: Function,
        required: true,
    },
});

const onClickEdit = () => {};

const onClickAdd = () => {};
</script>

<template>
    <div class="item border-l border-l-2 py-2 mb-4 border-slate-700 pl-4">
        <div class="flex">
            <div class="ability__name mb-4 text-lg">
                <div class="text-sm text-gray-500">Location</div>
                {{ locationName }}
            </div>
            <div class="ability__add ml-auto">
                <button
                    class="btn bg-sky-600 hover:bg-sky-800"
                    @click="onClickAdd"
                >
                    Add Ability
                </button>
            </div>
        </div>
        <div class="abilities">
            <div
                class="ability flex border text-sm text-gray-500 bg-gray-200 p-3 rounded gap-x-4 mb-1"
                v-for="ability in abilities"
                :key="ability.id_ability"
            >
                <div class="ml-auto">
                    <button
                        class="btn bg-sky-600 hover:bg-sky-800"
                        @click="onClickEdit"
                    >
                        <EditIcon />
                    </button>
                </div>
            </div>

            <div v-if="!abilities.length">
                <div
                    class="text-gray-500 text-sm bg-gray-200 p-3 rounded text-center"
                >
                    No abilities for this location.
                </div>
            </div>
        </div>
    </div>
</template>
