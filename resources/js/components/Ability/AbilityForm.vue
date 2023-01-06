<script setup>
import { ref, computed, watch, reactive, onMounted } from "vue";
import { $vfm } from "vue-final-modal";
import DataService from "../../services/DataService";

import EditIcon from "~icons/fa-solid/pencil-alt";
import CirlceNotchIcon from "~icons/fa-solid/circle-notch";
import InputError from "../controls/InputError.vue";
import ShipService from "../../services/ShipService";
import ConditionForm from "./ConditionForm.vue";

const abilityTypes = DataService.getAbilityTypes();
const variantsByType = DataService.getVariantsByAbilityType();
const amountTypes = DataService.getAmountTypes();
const sizes = DataService.getSizes();
const weaponClasses = DataService.getWeaponClasses();
const durationTypes = DataService.getDurationTypes();

const props = defineProps({
    ability: {
        type: Object,
        default: () => ({}),
    },
    onSave: {
        type: Function,
        required: true,
    },
});

const isValid = ref(false);
const errorMessage = ref("");
const isSaving = ref(false);
const shipClasses = ref([]);

const makeFormState = () => {
    return {
        type: props.ability?.type || "",
        variants: props.ability?.variants || [],
        amount_type: props.ability?.amount_type || "",
        amount: props.ability?.amount || "",
        weapon_classes: props.ability?.weapon_classes || [],
        weapon_sizes: props.ability?.weapon_sizes || [],
        notes: props.ability?.notes || "",
        duration_type: props.ability?.duration_type || "",
        duration: props.ability?.duration || "",
        applies_to_fleet: props.ability?.applies_to_fleet || false,
        for_class_ids: props.ability?.for_class_ids || [],
        target_class_ids: props.ability?.target_class_ids || [],
        conditions: props.ability?.conditions || [],
    };
};

const form = reactive(makeFormState());

const errors = reactive({
    type: "",
    variants: "",
    amount_type: "",
    amount: "",
    weapon_classes: "",
    weapon_sizes: "",
    notes: "",
    duration_type: "",
    duration: "",
    applies_to_fleet: "",
    for_class_ids: "",
    target_class_ids: "",
    conditions: "",
});

const dirty = reactive({
    type: false,
    variants: false,
    amount_type: false,
    amount: false,
    weapon_classes: false,
    weapon_sizes: false,
    notes: false,
    duration_type: false,
    duration: false,
    applies_to_fleet: false,
    for_class_ids: false,
    target_class_ids: false,
    conditions: false,
});

const resetForm = () => {
    form.value = makeFormState();

    Object.assign(
        errors,
        Object.keys(errors).reduce((acc, key) => {
            acc[key] = "";
            return acc;
        }, {})
    );

    Object.assign(
        dirty,
        Object.keys(dirty).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {})
    );

    errorMessage.value = "";
};

const validate = () => {
    // TODO: validate stuff
};

const onChangeForm = () => {
    validate();
};

const loadClasses = async () => {
    const classes = await ShipService.getShipClasses();
    shipClasses.value = classes;
};

const onAddCondition = () => {
    form.conditions.push({});
};

const onChangeCondition = (index, data) => {
    const conditions = [...form.conditions];
    conditions.splice(index, 1, data);
    form.conditions = conditions;
};

const onRemoveCondition = (index) => {
    const conditions = [...form.conditions];
    conditions.splice(index, 1);
    form.conditions = conditions;
};

const amountInput = computed(() => {
    let placeholder = "";
    let type = "number";

    if (form.amount_type === "percent") {
        placeholder = "Percent value: 10 = 10%";
    } else if (form.amount_type === "number") {
        placeholder = "Numeric value";
    } else if (form.amount_type === "seconds") {
        placeholder = "Seconds value: 10 = 10s";
    } else if (form.amount_type === "attacks") {
        placeholder = "Attack cycle: 10 = every 10 attacks";
    }

    return {
        placeholder,
        type,
    };
});

const durationInput = computed(() => {
    let placeholder = "";
    let type = "number";

    if (form.duration_type === "seconds") {
        placeholder = "First x seconds: 10 = 10s";
    } else if (form.duration_type === "attacks") {
        placeholder = "Attack cycle: 10 = every 10 attacks";
    }

    return {
        placeholder,
        type,
    };
});

const isWeaponsType = computed(() => {
    if (!form.type) {
        return false;
    }

    const found = abilityTypes.find((type) => type.slug === form.type);

    return !!found.weapons;
});

watch(
    () => props.ability,
    () => {
        resetForm();
    }
);

onMounted(() => {
    loadClasses();
});
</script>

<template>
    <form action="" class="ability-form" @submit.prevent="onSubmit">
        <h3 class="text-xl font-medium mb-6">Manage Ability</h3>

        <div class="lg:flex gap-x-3">
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Effect Type</label>
                    <VSelect
                        label="name"
                        :options="abilityTypes"
                        :reduce="(type) => type.slug"
                        :multiple="false"
                        :searchable="true"
                        :clearable="false"
                        v-model="form.type"
                        @input="onChangeForm"
                    />
                    <InputError :error="errors.type" :dirty="dirty.type" />
                </div>
            </div>
            <div class="lg:w-1/2">
                <div
                    class="form-group"
                    v-if="form.type && variantsByType[form.type]"
                >
                    <label>Variation</label>
                    <VSelect
                        :options="variantsByType[form.type]"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.variants"
                        @input="onChangeForm"
                    />
                    <InputError :error="errors.type" :dirty="dirty.type" />
                </div>
            </div>
        </div>

        <div class="form-group">
            <label>Applies to Fleet</label>
            <div class="checkbox">
                <label>
                    <input
                        type="checkbox"
                        class="mr-2"
                        name="applies_to_fleet"
                        v-model="form.applies_to_fleet"
                        :true-value="true"
                        :false-value="false"
                        @change="onChangeForm"
                    />
                    {{ form.applies_to_fleet ? "Yes" : "No" }}
                </label>
            </div>
        </div>

        <div class="lg:flex gap-x-3">
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Amount Type</label>
                    <VSelect
                        label="name"
                        :options="amountTypes"
                        :reduce="(type) => type.slug"
                        :multiple="false"
                        :searchable="true"
                        :clearable="false"
                        v-model="form.amount_type"
                        @input="onChangeForm"
                    />
                    <InputError
                        :error="errors.amount_type"
                        :dirty="dirty.amount_type"
                    />
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Amount</label>
                    <input
                        :type="amountInput.type"
                        :placeholder="amountInput.placeholder"
                        class="form-control"
                        v-model="form.amount"
                        @input="onChangeForm"
                    />
                    <InputError :error="errors.amount" :dirty="dirty.amount" />
                </div>
            </div>
        </div>

        <div class="lg:flex gap-x-3" v-if="isWeaponsType">
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Weapon Classes</label>
                    <VSelect
                        :options="weaponClasses"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.weapon_classes"
                        @input="onChangeForm"
                    />
                    <InputError
                        :error="errors.weapon_classes"
                        :dirty="dirty.weapon_classes"
                    />
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Weapon Sizes</label>
                    <VSelect
                        :options="sizes"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.weapon_sizes"
                        @input="onChangeForm"
                    />
                    <InputError
                        :error="errors.weapon_sizes"
                        :dirty="dirty.weapon_sizes"
                    />
                </div>
            </div>
        </div>

        <div class="lg:flex gap-x-3">
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Duration Type</label>
                    <VSelect
                        label="name"
                        :options="durationTypes"
                        :reduce="(type) => type.slug"
                        :multiple="false"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.duration_type"
                        @input="onChangeForm"
                    />
                    <InputError
                        :error="errors.duration_type"
                        :dirty="dirty.duration_type"
                    />
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Duration</label>
                    <input
                        :type="durationInput.type"
                        :placeholder="durationInput.placeholder"
                        class="form-control"
                        v-model="form.duration"
                        @input="onChangeForm"
                    />
                    <InputError
                        :error="errors.duration"
                        :dirty="dirty.duration"
                    />
                </div>
            </div>
        </div>

        <div class="lg:flex gap-x-3">
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label
                        >Boosts Specific Classes
                        <small>(in fleet)</small></label
                    >
                    <VSelect
                        label="name"
                        :options="shipClasses"
                        :reduce="(sc) => sc.id_class"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.for_class_ids"
                        @input="onChangeForm"
                    />
                    <InputError
                        :error="errors.for_class_ids"
                        :dirty="dirty.for_class_ids"
                    />
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label
                        >Targets Specific Classes
                        <small>(enemy fleet)</small></label
                    >
                    <VSelect
                        label="name"
                        :options="shipClasses"
                        :reduce="(sc) => sc.id_class"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.target_class_ids"
                        @input="onChangeForm"
                    />
                    <InputError
                        :error="errors.target_class_ids"
                        :dirty="dirty.target_class_ids"
                    />
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="text-lg font-medium mb-4">Fleet Conditions</label>

            <div class="conditions-list mb-4">
                <div
                    class="mb-2"
                    v-for="(condition, index) in form.conditions"
                    :key="index"
                >
                    <ConditionForm
                        :condition="condition"
                        :ship-classes="shipClasses"
                        @change="(data) => onChangeCondition(index, data)"
                        @remove="onRemoveCondition(index)"
                    />
                </div>
            </div>

            <button
                class="btn btn-sm bg-gray-600 hover:bg-gray-800"
                type="button"
                @click="onAddCondition"
            >
                Add Condition
            </button>
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea
                v-model="form.notes"
                rows="5"
                class="form-control"
                placeholder="Type notes here..."
            ></textarea>
        </div>

        <div class="form-group">
            <button
                type="submit"
                class="btn bg-sky-600 hover:bg-sky-800"
                :disabled="!isValid || isSaving"
            >
                <template v-if="isSaving">
                    <CirlceNotchIcon class="animate-spin" />
                </template>
                <template v-else> Save </template>
            </button>
        </div>
    </form>
</template>
