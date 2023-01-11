<script setup>
import ContentBox from "./ContentBox.vue";

import { ref, reactive, computed } from "vue";
import ShipSelectCard from "../Ship/ShipSelectCard.vue";
import UserShipForm from "../Ship/UserShipForm.vue";

const props = defineProps({
    userShip: {
        type: Object,
        required: true,
    },
    onSave: {
        type: Function,
        required: true,
    },
    onDelete: {
        type: Function,
        default: null,
    },
});

const onSaveShip = (data) => {
    return props.onSave(data);
};
const onDeleteShip = (userShip) => {
    if (props.onDelete) {
        return props.onDelete(userShip);
    }
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
                    Update your ship
                </h2>

                <UserShipForm
                    :ship="userShip.ship"
                    :userShip="userShip"
                    :onSave="onSaveShip"
                    :onDelete="onDeleteShip"
                />
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.custom-bg {
    background: rgba(87, 122, 150, 0.5);
}
</style>
