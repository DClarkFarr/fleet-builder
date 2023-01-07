<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import { $vfm } from "vue-final-modal";

import { getAbilityParser } from "../../methods/ability";
import DataService from "../../services/DataService";

import EditIcon from "~icons/fa-solid/pencil-alt";
import AttackIcon from "~icons/fluent-emoji/crossed-swords";
import DefenseIcon from "~icons/fluent-emoji/shield";
import PassiveIcon from "~icons/fluent-emoji/fast-up-button";
import CrownIcon from "~icons/fluent-emoji/crown";
import TrashIcon from "~icons/fa-solid/trash-alt";

import ShipService from "../../services/ShipService";

import AbilityModal from "./AbilityModal.vue";

const abilityAffects = DataService.ABILITY_AFFECTS;

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
    onDelete: {
        type: Function,
        required: true,
    },
});

const modals = ref({});

const onEditAbility = async (id_ability) => {
    await $vfm.hideAll();

    $vfm.show({
        component: AbilityModal,
        bind: {
            ability: computedAbilities.value.find(
                (a) => a.id_ability === id_ability
            ),
            location: props.location,
            locationName: props.locationName,
            onSave: (data) => {
                onUpdateAbility(id_ability, data);
                $vfm.hideAll();
            },
        },
    });
};

const deletingAbility = ref(null);

const onDeleteAbility = async (id_ability) => {
    deletingAbility.value = id_ability;

    try {
        await props.onDelete(id_ability);
    } catch (e) {
        console.error(e);
    }

    deletingAbility.value = null;
};

const shipClasses = ref([]);

const onAddAbility = async () => {
    await $vfm.hideAll();

    $vfm.show({
        component: AbilityModal,
        bind: {
            ability: defaultAbility,
            location: props.location,
            locationName: props.locationName,
            onSave: (data) => {
                onCreateAbility(data);
                $vfm.hideAll();
            },
        },
    });
};

const onCreateAbility = (abilityForm) => {
    const abilities = [...props.abilities];
    abilities.push(abilityForm);

    props.onSave(abilities);
};

const onUpdateAbility = (id_ability, data) => {
    const locationAbilities = [...props.abilities].filter(
        (a) => a.location === props.location
    );

    const updateIndex = locationAbilities.findIndex(
        (a) => a.id_ability === id_ability
    );

    locationAbilities[updateIndex] = {
        ...locationAbilities[updateIndex],
        ...data,
    };

    props.onSave(locationAbilities);
};

const defaultAbility = computed(() => {
    return {
        amount_type: DataService.AMOUNT_TYPES.PERCENT,
        amount: 8,
    };
});

const computedAbilities = computed(() => {
    return props.abilities.map((ability) => {
        const parser = getAbilityParser(ability, {
            shipClasses: toRaw(shipClasses.value),
        });

        ability.affectType = parser.affectType;
        ability.abilityTypeName = parser.abilityTypeName;
        ability.amountDescription = parser.amountDescription;
        ability.fullDescription = parser.fullDescription;

        return ability;
    });
});

onMounted(async () => {
    const res = await ShipService.getShipClasses();
    shipClasses.value = [...res];
});
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
                    @click="onAddAbility"
                >
                    Add Ability
                </button>
            </div>
        </div>
        <div class="ability-items">
            <div
                class="ability flex items-center text-sm p-3 rounded gap-x-4 mb-1"
                :class="[
                    `ability--${ability.affectType}`,
                    {
                        'ability--fleet': ability.applies_to_fleet,
                        'opacity-60': deletingAbility === ability.id_ability,
                    },
                ]"
                v-for="ability in computedAbilities"
                :key="ability.id_ability"
            >
                <div class="ability__icons">
                    <div
                        v-tooltip="'Attack'"
                        v-if="ability.affectType === abilityAffects.ATTACK"
                    >
                        <AttackIcon />
                    </div>
                    <div
                        v-tooltip="'Defense'"
                        v-else-if="
                            ability.affectType === abilityAffects.DEFENSE
                        "
                    >
                        <DefenseIcon />
                    </div>
                    <div
                        v-tooltip="'Passive'"
                        v-else-if="
                            ability.affectType === abilityAffects.PASSIVE
                        "
                    >
                        <PassiveIcon />
                    </div>
                    <div
                        v-if="ability.applies_to_fleet"
                        v-tooltip="'Fleet Boost'"
                    >
                        <CrownIcon />
                    </div>
                </div>
                <div class="ability__description">
                    <div class="ability__name flex gap-x-2 items-center">
                        <div class="font-medium">
                            {{ ability.abilityTypeName }}
                        </div>
                        <div class="font-bold">
                            {{ ability.amountDescription }}
                        </div>
                    </div>
                    <div class="ability__full-description">
                        {{ ability.fullDescription }}

                        <small
                            class="text-sm italic text-sky-500 pl-2"
                            v-if="ability.notes?.trim()?.length"
                        >
                            {{ ability.notes }}
                        </small>
                    </div>
                </div>
                <div
                    class="ml-auto flex gap-x-2 items-center"
                    v-if="deletingAbility !== ability.id_ability"
                >
                    <div>
                        <button
                            class="btn bg-sky-600 hover:bg-sky-800"
                            @click="onEditAbility(ability.id_ability)"
                        >
                            <EditIcon />
                        </button>
                    </div>
                    <div>
                        <button
                            class="btn bg-red-700 hover:bg-red-800"
                            @click="onDeleteAbility(ability.id_ability)"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!computedAbilities.length">
                <div
                    class="text-gray-500 text-sm bg-gray-200 p-3 rounded text-center"
                >
                    No abilities for this location.
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
.ability-items {
    .ability {
        &--defense,
        &--attack,
        &--passive {
            @apply border-l-8;
        }

        &--defense {
            @apply border-blue-500;
        }

        &--attack {
            @apply border-red-500;
        }

        &--passive {
            @apply border-green-500;
        }

        @apply bg-gray-200 text-gray-500;

        &--fleet {
            @apply bg-yellow-800/50 text-gray-900;
        }
    }
}
</style>
