<script setup>
import ContentBox from "./ContentBox.vue";

import { ref } from "vue";
import UserShipForm from "../Ship/UserShipForm.vue";

import SelectedShipList from "./ship/ShipSelectList.vue";

const props = defineProps({
    ships: {
        type: Array,
        required: true,
    },
    shipClasses: {
        type: Array,
        required: true,
    },
    onAdd: {
        type: Function,
        required: true,
    },
    title: {
        type: String,
        default: "Add a ship to your fleet",
    },
});

const selectedShip = ref(null);

const onClickSelect = (ship) => {
    selectedShip.value = ship;
};

const onCreateUserShip = (data) => {
    return props.onAdd(data);
};
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <div class="add-ship">
                <h2 class="text-xl text-modal-title font-medium mb-4">
                    {{ title }}
                </h2>

                <template v-if="selectedShip">
                    <div class="flex gap-x-4 items-center mb-4">
                        <div>
                            <button
                                class="btn btn-sm btn-red"
                                @click="selectedShip = null"
                            >
                                Unselect Ship
                            </button>
                        </div>
                        <div>
                            <h2 class="text-xl text-modal-title">
                                Add <b>{{ selectedShip.name }}</b> to your fleet
                            </h2>
                        </div>
                    </div>
                    <UserShipForm
                        :ship="selectedShip"
                        :onSave="onCreateUserShip"
                    />
                </template>
                <template v-else>
                    <SelectedShipList
                        :ships="ships"
                        :shipClasses="shipClasses"
                        @select="onClickSelect"
                    />
                </template>
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.custom-bg {
    background: rgba(87, 122, 150, 0.5);
}
</style>
