<script setup>
import { reactive, toRaw, ref, watch, computed } from "vue";
import { $vfm } from "vue-final-modal";
import { useToast } from "vue-toastification";
import useBuilderStore from "../../../stores/builderStore";

import InputError from "../../controls/InputError.vue";
import ContentBox from "../ContentBox.vue";
import SelectUserShipModal from "../ship/SelectUserShipModal.vue";

const props = defineProps({
    location: {
        type: Object,
        required: true,
    },
    fleet: {
        type: Object,
        default: null,
    },
    onSave: {
        type: Function,
        required: true,
    },
    onDelete: {
        type: Function,
        required: true,
    },
    excludeSelected: {
        type: Boolean,
        default: false,
    },
    onSelectShip: {
        type: Function,
        required: true,
    },
    onUnselectShip: {
        type: Function,
        required: true,
    },
});

const toast = useToast();
const builderStore = useBuilderStore();

const form = reactive({
    name: "",
    leadership: 0,
});

const errors = reactive({
    name: "",
    leadership: "",
});

const dirty = reactive({
    name: false,
    leadership: false,
});

const isValid = ref(false);
const errorMessage = ref("");
const isSaving = ref(false);
const isChangingShip = ref(false);

const validate = () => {
    if (!form.name) {
        errors.name = "Name is required";
    } else {
        errors.name = "";
    }

    if (!form.leadership) {
        errors.leadership = "Leadership is required";
    } else {
        errors.leadership = "";
    }

    isValid.value = !Object.values(errors).some((error) => !!error);
};

const onSaveFleet = async () => {
    if (!isValid.value) {
        return;
    }

    isSaving.value = true;

    try {
        await props.onSave(props.location.slug, toRaw(form));
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }

    isSaving.value = false;
};

const onClickDelete = async (id_workshop_fleet) => {
    isSaving.value = true;

    try {
        await props.onDelete(id_workshop_fleet);
    } catch (error) {
        errorMessage.value = error.message;
    }

    isSaving.value = false;
};

const onShowShipSelectModal = () => {
    $vfm.show({
        component: SelectUserShipModal,
        bind: {
            userShips: computedUserShips,
            shipClasses: shipClasses.value,
            busy: isChangingShip,
            onSelect: async (userShip) => {
                isChangingShip.value = true;

                try {
                    await props.onSelectShip(
                        props.fleet.id_workshop_fleet,
                        userShip.id_user_ship
                    );
                } catch (err) {
                    toast.error(err.response?.data?.message || err.message);
                }

                isChangingShip.value = false;
            },
            onUnselect: async (userShip) => {
                isChangingShip.value = true;

                try {
                    await props.onUnselectShip(
                        props.fleet.id_workshop_fleet,
                        userShip.id_user_ship
                    );
                } catch (err) {
                    toast.error(err.response?.data?.message || err.message);
                }

                isChangingShip.value = false;
            },
        },
    });
};

const workshop = computed(() => {
    return builderStore.workshops.find(
        (w) => w.id_workshop === props.fleet.id_workshop
    );
});
const selectedFleet = computed(() =>
    workshop.value?.fleets?.find(
        (f) => f.id_workshop_fleet === props.fleet.id_workshop_fleet
    )
);
const shipClasses = computed(() => builderStore.shipClasses);

const selectedUserShipIds = computed(() => {
    return workshop.value.fleets?.reduce((acc, fleet) => {
        return [...acc, ...fleet.user_ships.map((us) => us.id_user_ship)];
    }, []);
});

const computedUserShips = computed(() => {
    let userShips = builderStore.userShips
        .map((us) => toRaw(us))
        .filter((us) => us.visible);

    if (props.excludeSelected) {
        userShips = userShips.filter((us) => {
            return !selectedUserShipIds.value.includes(us.id_user_ship);
        });
    }

    const mapped = userShips.map((us) => {
        return {
            ...us,
            selected: selectedUserShipIds.value.includes(us.id_user_ship),
        };
    });

    return mapped;
});

watch(form, validate, { immediate: true });

watch(
    selectedFleet,
    (fleet) => {
        if (fleet) {
            form.name = fleet.name;
            form.leadership = fleet.leadership;
        }
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <form action="" class="fleet-form" @submit.prevent="onSaveFleet">
                <div class="flex gap-x-3 justify-between">
                    <div>
                        <h1 class="text-2xl modal__title font-medium mb-6">
                            {{ location.name }}
                        </h1>
                    </div>
                    <div v-if="fleet">
                        <button
                            class="btn btn-red btn-sm"
                            type="button"
                            @click="onClickDelete(fleet.id_workshop_fleet)"
                            :disabled="isSaving"
                        >
                            <template v-if="isSaving"> Deleting... </template>
                            <template v-else> Delete </template>
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Fleet Name</label>
                    <input
                        type="text"
                        class="form-control"
                        v-model="form.name"
                    />

                    <InputError :error="errors.name" :dirty="dirty.name" />
                </div>
                <div class="form-group mb-10">
                    <label>Leadership Capacity</label>
                    <input
                        type="text"
                        class="form-control"
                        v-model="form.leadership"
                    />

                    <InputError
                        :error="errors.leadership"
                        :dirty="dirty.leadership"
                    />
                </div>

                <div>
                    <button
                        type="button"
                        class="btn btn-bright-blue btn-sm"
                        @click="onShowShipSelectModal"
                    >
                        Add Ship
                    </button>
                </div>
                <div class="select-list p-4 mb-8" v-if="fleet"></div>

                <div class="form-group pt-4">
                    <button
                        class="btn btn-blue w-full block"
                        :disabled="!isValid || isSaving"
                        type="submit"
                    >
                        <span v-if="isSaving">Saving...</span>
                        <span v-else>Save</span>
                    </button>
                </div>
            </form>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less" scoped>
.select-list {
    @apply border-2 rounded border-dark-border-start;
    background: linear-gradient(
        180deg,
        rgba(47, 73, 125, 0.5),
        rgba(24, 43, 84, 0.5)
    );

    box-shadow: 0 0 3px 0 #517090;
}
</style>
