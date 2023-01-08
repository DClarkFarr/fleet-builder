<script setup>
import { ref, computed, watch, reactive, onMounted, toRaw } from "vue";
import DataService from "../../services/DataService";

import CirlceNotchIcon from "~icons/fa-solid/circle-notch";
import InputError from "../controls/InputError.vue";
import ShipService from "../../services/ShipService";
import ConditionForm from "./ConditionForm.vue";
import AmountForm from "./AmountForm.vue";

const abilityTypes = DataService.getAbilityTypes();
const variantsByType = DataService.getVariantsByAbilityType();
const sizes = DataService.getSizes();
const weaponClasses = DataService.getWeaponClasses();
const durationTypes = DataService.getDurationTypes();
const repeatTypes = DataService.getRepeatTypes();

const props = defineProps({
    location: {
        type: String,
        required: true,
    },
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
        amounts: props.ability?.amounts || [{}],
        weapon_classes: props.ability?.weapon_classes || [],
        weapon_sizes: props.ability?.weapon_sizes || [],
        notes: props.ability?.notes || "",
        duration_type: props.ability?.duration_type || "",
        duration: props.ability?.duration || "",
        repeat_type: props.ability?.repeat_type || "",
        repeat: props.ability?.repeat || "",
        applies_to_fleet:
            typeof props.ability?.applies_to_fleet === "boolean"
                ? props.ability.applies_to_fleet
                : props.location?.indexOf("flagship") > -1
                ? true
                : false,
        flagship_required:
            typeof props.ability?.flagship_required === "boolean"
                ? props.ability.flagship_required
                : props.location?.indexOf("flagship") > -1
                ? true
                : false,
        for_class_ids: props.ability?.for_class_ids || [],
        target_class_ids: props.ability?.target_class_ids || [],
        conditions: props.ability?.conditions || [],
    };
};

const form = reactive(makeFormState());

const errors = reactive({
    type: "",
    variants: "",
    amounts: "",
    weapon_classes: "",
    weapon_sizes: "",
    notes: "",
    duration_type: "",
    duration: "",
    repeat_type: "",
    repeat: "",
    for_class_ids: "",
    target_class_ids: "",
    conditions: "",
});

const dirty = reactive({
    type: false,
    variants: false,
    amounts: false,
    weapon_classes: false,
    weapon_sizes: false,
    notes: false,
    duration_type: false,
    duration: false,
    repeat_type: false,
    repeat: false,
    for_class_ids: false,
    target_class_ids: false,
    conditions: false,
});

const resetErrors = () => {
    Object.assign(
        errors,
        Object.keys(errors).reduce((acc, key) => {
            acc[key] = "";
            return acc;
        }, {})
    );
};

const resetForm = () => {
    form.value = makeFormState();

    resetErrors();

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
    resetErrors();

    if (!form.type) {
        errors.type = "Ability type is required";
    }

    if (form.amounts.length === 0) {
        errors.errorMessage = "Please add an amount";
    }

    if (form.duration_type && isNaN(parseInt(form.duration))) {
        errors.duration = "Duration is required";
    }

    if (form.repeat_type && isNaN(parseInt(form.repeat))) {
        errors.repeat = "Repeat is required";
    }

    isValid.value = !Object.values(errors).some((error) => error);
};

const onChangeForm = (field = "") => {
    validate();

    Object.entries(form).forEach(([key, value]) => {
        if (value !== props.ability[key]) {
            dirty[key] = true;
        }
    });

    if (field === "applies_to_fleet" && !form.applies_to_fleet) {
        form.for_class_ids = [];
    }

    if (field === "for_class_ids" && form.for_class_ids.length) {
        form.applies_to_fleet = true;
    }
};

const onSubmit = async () => {
    if (!isValid.value || isSaving.value) {
        return;
    }

    isSaving.value = true;

    try {
        const data = {
            ...toRaw(form),
            amounts: form.amounts.map((amount) => toRaw(amount)),
        };
        await props.onSave(data);
    } catch (err) {
        errorMessage.value = err.message;
    }

    isSaving.value = false;
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

const onAddAmount = () => {
    form.amounts.push(reactive({}));
};

const onChangeAmount = (index, data) => {
    const amounts = [...form.amounts];

    amounts.splice(index, 1, data);

    form.amounts = amounts;
};

const onRemoveAmount = (index) => {
    const amounts = [...form.amounts];
    amounts.splice(index, 1);
    form.amounts = amounts;
};

const hasVariation = computed(() => form.type && variantsByType[form.type]);

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

const repeatInput = computed(() => {
    let placeholder = "";
    let type = "number";

    if (form.repeat_type === "seconds") {
        placeholder = "Every x seconds";
    } else if (form.repeat_type === "attacks") {
        placeholder = "Every x attacks";
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

const isRepeatType = computed(() => {
    if (!form.type) {
        return false;
    }

    const found = abilityTypes.find((type) => type.slug === form.type);

    return !!found.repeats;
});

watch(
    () => props.ability,
    () => {
        resetForm();
    }
);

watch(form, () => {
    validate();
});

onMounted(async () => {
    await loadClasses();

    validate();
});
</script>

<template>
    <form action="" class="ability-form" @submit.prevent="onSubmit">
        <h3 class="text-xl font-medium mb-6">Manage Ability</h3>

        <div class="lg:flex items-end gap-x-3">
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
                        @close="onChangeForm"
                    />
                    <InputError :error="errors.type" :dirty="dirty.type" />
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="form-group" v-if="hasVariation">
                    <label>Variation</label>
                    <blockquote class="italic">
                        Note: Selecting none means "all"
                    </blockquote>
                    <VSelect
                        :options="variantsByType[form.type]"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.variants"
                        @input="onChangeForm"
                        @close="onChangeForm"
                    />
                    <InputError :error="errors.type" :dirty="dirty.type" />
                </div>
            </div>
        </div>

        <div class="lg:flex gap-x-3" v-if="isWeaponsType">
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Weapon Classes</label>
                    <VSelect
                        label="name"
                        :options="weaponClasses"
                        :reduce="(c) => c.slug"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.weapon_classes"
                        @input="onChangeForm"
                        @close="onChangeForm"
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
                        label="name"
                        :reduce="(size) => size.slug"
                        :options="sizes"
                        :multiple="true"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.weapon_sizes"
                        @input="onChangeForm"
                        @close="onChangeForm"
                    />
                    <InputError
                        :error="errors.weapon_sizes"
                        :dirty="dirty.weapon_sizes"
                    />
                </div>
            </div>
        </div>

        <div class="amount form-group">
            <div>
                <div class="amounts-list">
                    <div v-for="(amount, index) in form.amounts" :key="index">
                        <AmountForm
                            :index="index"
                            :amount="amount"
                            @change="(data) => onChangeAmount(index, data)"
                            @remove="onRemoveAmount(index)"
                        />
                    </div>
                    <div
                        class="mb-2 bg-slate-100 p-2 text-slate-600"
                        v-if="!form.amounts.length"
                    >
                        No amount values yet
                    </div>
                </div>

                <button
                    class="btn btn-sm bg-gray-600 hover:bg-gray-800"
                    type="button"
                    @click="onAddAmount"
                >
                    Add Amount
                </button>
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
                        @close="onChangeForm"
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

        <div class="lg:flex gap-x-3" v-if="isRepeatType">
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Repeat Type</label>
                    <VSelect
                        label="name"
                        :options="repeatTypes"
                        :reduce="(type) => type.slug"
                        :multiple="false"
                        :searchable="true"
                        :clearable="true"
                        v-model="form.repeat_type"
                        @input="onChangeForm"
                        @close="onChangeForm"
                    />
                    <InputError
                        :error="errors.repeat_type"
                        :dirty="dirty.repeat_type"
                    />
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Repeat</label>
                    <input
                        :type="repeatInput.type"
                        :placeholder="repeatInput.placeholder"
                        class="form-control"
                        v-model="form.repeat"
                        @input="onChangeForm"
                    />
                    <InputError :error="errors.repeat" :dirty="dirty.repeat" />
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
                        @input="onChangeForm('for_class_ids')"
                        @close="onChangeForm('for_class_ids')"
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
                        @close="onChangeForm"
                    />
                    <InputError
                        :error="errors.target_class_ids"
                        :dirty="dirty.target_class_ids"
                    />
                </div>
            </div>
        </div>

        <div class="lg:flex gap-x-3">
            <div class="lg:w-1/2">
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
                                @change="onChangeForm('applies_to_fleet')"
                            />
                            {{ form.applies_to_fleet ? "Yes" : "No" }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="lg:w-1/2">
                <div class="form-group">
                    <label>Must be flagship</label>
                    <div class="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                class="mr-2"
                                name="flagship_required"
                                v-model="form.flagship_required"
                                :true-value="true"
                                :false-value="false"
                                @change="onChangeForm('flagship_required')"
                            />
                            {{ form.flagship_required ? "Yes" : "No" }}
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="text-lg font-medium mb-4">Fleet Conditions</label>
            <div>
                <div class="conditions-list mb-2">
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
                    <div
                        class="mb-2 bg-slate-100 p-2 text-slate-600"
                        v-if="!form.conditions.length"
                    >
                        No Conditions yet
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

        <div class="form-group" v-if="errorMessage">
            <InputError :error="errorMessage" />
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
