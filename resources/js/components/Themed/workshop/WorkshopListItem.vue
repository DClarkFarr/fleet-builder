<script setup>
import { computed, toRaw } from "vue";
import TrashIcon from "~icons/fa-solid/trash-alt";

const props = defineProps({
    workshop: {
        type: Object,
        default: null,
    },
    onDelete: {
        type: Function,
        required: true,
    },
});

const emit = defineEmits(["select"]);

const fleetCount = computed(() => {
    return props.workshop.fleets.length;
});

const shipCount = computed(() => {
    return props.workshop.fleets.reduce((acc, fleet) => {
        return acc + fleet.user_ships.length;
    }, 0);
});

const onClickDelete = () => {
    props.onDelete(toRaw(props.workshop));
};

const onClickSelect = () => {
    emit("select", toRaw(props.workshop));
};
</script>

<template>
    <div class="workshop-list-item cursor-pointer p-4" @click="onClickSelect">
        <div class="flex items-center">
            <div class="border-r border-dark-border-end pr-4 grow">
                <div class="flex w-100">
                    <div class="mr-4">
                        <div class="text-sm text-dark-text">
                            {{ workshop.arcade ? "Arcade" : "Simulation" }}
                        </div>
                        <div
                            class="text-2xl font-medium text-dark-text leading-none text-white"
                        >
                            {{ workshop.name }}
                        </div>
                    </div>
                    <div class="self-end">
                        <div class="text-sm">
                            Ships: <b>{{ shipCount }}</b>
                        </div>
                        <div class="text-sm">
                            Fleets: <b>{{ fleetCount }}</b>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pl-4 shrink">
                <button
                    class="btn btn-red btn-sm"
                    @click.stop.prevent="onClickDelete"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.workshop-list-item {
    background: rgba(79, 117, 157, 0.35);

    &:hover {
        background: rgba(79, 117, 157, 0.75);
    }
}
</style>
