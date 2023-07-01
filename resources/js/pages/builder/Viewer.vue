<script setup>
import { onMounted, ref, computed } from "vue";
import { cloneDeep, sum } from "lodash";
import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import {
    augmentShipTotalStats,
    getUserShipParsedAbilityStats,
    sumFleetTotalStats,
} from "../../methods/abilityStatParser";
import useBuilderStore from "../../stores/builderStore";
import useUserStore from "../../stores/userStore";

import Chips from "@/components/Themed/ship/Chips.vue";
import { summedStatsTotalToText } from "../../methods/summedAbilityToText";
import DataService from "../../services/DataService";
import StatTotal from "../../components/Themed/ability/StatTotal.vue";
import TimesIcon from "~icons/fa-solid/times";
import CheckIcon from "~icons/fa-solid/check";

const attackColumns = [
    DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED,
    DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
    DataService.ABILITY_TYPES.INCREASE_ACCURACY,
    DataService.ABILITY_TYPES.INCREASE_EVADE,
    DataService.ABILITY_TYPES.EXTRA_ATTACK,
];

const armorColumns = [
    [
        DataService.ABILITY_TYPES.REDUCE_DAMAGE,
        DataService.RESISTANCE_TYPES.ARMOR,
    ],
    DataService.ABILITY_TYPES.INCREASE_ARMOR,
];

const resistanceColumns = [DataService.ABILITY_TYPES.INCREASE_RESISTENCE];

const hpColumns = [
    DataService.ABILITY_TYPES.INCREASE_HP,
    [
        DataService.ABILITY_TYPES.REDUCE_DAMAGE,
        DataService.RESISTANCE_TYPES.HULL,
    ],
];

const shieldColumns = [
    [
        DataService.ABILITY_TYPES.REDUCE_DAMAGE,
        DataService.RESISTANCE_TYPES.SHIELDS,
    ],
    DataService.ABILITY_TYPES.INCREASE_SHIELD,
];

const penetrationColumns = [DataService.ABILITY_TYPES.INCREASE_PENETRATION];

const sortMap = {
    ship_class: {
        label: "Ship Class (BB, DR, etc)",
        filters: [
            {
                mapTo: "class_sort",
            },
        ],
    },
    weapon_strength: {
        label: "Total Weapon Slot Strength",
        filters: [
            {
                slotStrength: "weapon",
                sizes: ["s", "m", "l"],
            },
        ],
    },
    weapon_strength__l: {
        label: "Total Large Weapon Slot Strength",
        filters: [
            {
                slotStrength: "weapon",
                sizes: ["l"],
            },
        ],
    },
    weapon_strength__m: {
        label: "Total Medium Weapon Slot Strength",
        filters: [
            {
                slotStrength: "weapon",
                sizes: ["m"],
            },
        ],
    },
    weapon_strength__s: {
        label: "Total Small Weapon Slot Strength",
        filters: [
            {
                slotStrength: "weapon",
                sizes: ["s"],
            },
        ],
    },
    // armor-strength
    armor_strength: {
        label: "Total Armor Slot Strength",
        filters: [
            {
                slotStrength: "armor",
                sizes: ["s", "m", "l"],
            },
        ],
    },
    armor_strength__l: {
        label: "Total Large Armor Slot Strength",
        filters: [
            {
                slotStrength: "armor",
                sizes: ["l"],
            },
        ],
    },
    armor_strength__m: {
        label: "Total Medium Armor Slot Strength",
        filters: [
            {
                slotStrength: "armor",
                sizes: ["m"],
            },
        ],
    },
    armor_strength__s: {
        label: "Total Small Armor Slot Strength",
        filters: [
            {
                slotStrength: "armor",
                sizes: ["s"],
            },
        ],
    },
    // unit-strenth, all, and sizes l, m s
    unit_strength: {
        label: "Total Unit Slot Strength",
        filters: [
            {
                slotStrength: "unit",
                sizes: ["s", "m", "l"],
            },
        ],
    },
    unit_strength__l: {
        label: "Total Large Unit Slot Strength",
        filters: [
            {
                slotStrength: "unit",
                sizes: ["l"],
            },
        ],
    },
    unit_strength__m: {
        label: "Total Medium Unit Slot Strength",
        filters: [
            {
                slotStrength: "unit",
                sizes: ["m"],
            },
        ],
    },
    unit_strength__s: {
        label: "Total Small Unit Slot Strength",
        filters: [
            {
                slotStrength: "unit",
                sizes: ["s"],
            },
        ],
    },
    energy: {
        label: "Ship Energy",
        filters: [
            {
                shipField: "energy",
            },
        ],
    },
    chip_level: {
        label: "Chip Level",
        filters: [
            {
                userShipField: "chip_level",
            },
        ],
    },
    [DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE]: {
        label: "Any Weapon Damage",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                variants: [],
            },
        ],
    },

    //increase_weapon_damage + classes beam, kinetic and missile
    [`${DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE}__${DataService.WEAPON_CLASSES.BEAM}`]:
        {
            label: "Beam Damage",
            filters: [
                {
                    abilityType:
                        DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                    weapon_classes: [DataService.WEAPON_CLASSES.BEAM],
                },
            ],
        },
    [`${DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE}__${DataService.WEAPON_CLASSES.MISSILE}`]:
        {
            label: "Missile Damage",
            filters: [
                {
                    abilityType:
                        DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                    weapon_classes: [DataService.WEAPON_CLASSES.MISSILE],
                },
            ],
        },
    [`${DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE}__${DataService.WEAPON_CLASSES.KINETIC}`]:
        {
            label: "Kinetic Damage",
            filters: [
                {
                    abilityType:
                        DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                    weapon_classes: [DataService.WEAPON_CLASSES.KINETIC],
                },
            ],
        },

    [`${DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE}__${DataService.RESISTANCE_TYPES.SHIELDS}`]:
        {
            label: "Extra Damage to Shields",
            filters: [
                {
                    abilityType:
                        DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                    variants: [DataService.RESISTANCE_TYPES.SHIELDS],
                },
            ],
        },
    [`${DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE}__${DataService.RESISTANCE_TYPES.HULL}`]:
        {
            label: "Extra Damage to Hull",
            filters: [
                {
                    abilityType:
                        DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                    variants: [DataService.RESISTANCE_TYPES.HULL],
                },
            ],
        },
    [`${DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE}__${DataService.RESISTANCE_TYPES.ARMOR}`]:
        {
            label: "Extra Damage to Armor",
            filters: [
                {
                    abilityType:
                        DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                    variants: [DataService.RESISTANCE_TYPES.ARMOR],
                },
            ],
        },

    [DataService.ABILITY_TYPES.INCREASE_PENETRATION]: {
        label: "Shield Penetration",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_PENETRATION,
                variants: [DataService.RESISTANCE_TYPES.SHIELDS],
            },
        ],
    },

    [DataService.ABILITY_TYPES.INCREASE_ARMOR]: {
        label: "Armor",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_ARMOR,
            },
            {
                abilityType: DataService.ABILITY_TYPES.REDUCE_DAMAGE,
                variants: [DataService.RESISTANCE_TYPES.ARMOR],
            },
        ],
    },

    [DataService.ABILITY_TYPES.INCREASE_RESISTENCE]: {
        label: "Any Resistance",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_RESISTENCE,
            },
        ],
    },
    [`${DataService.ABILITY_TYPES.INCREASE_RESISTENCE}__${DataService.WEAPON_CLASSES.BEAM}`]:
        {
            label: "Beam Resistance",
            filters: [
                {
                    abilityType: DataService.ABILITY_TYPES.INCREASE_RESISTENCE,
                    weapon_classes: [DataService.WEAPON_CLASSES.BEAM],
                },
            ],
        },
    [`${DataService.ABILITY_TYPES.INCREASE_RESISTENCE}__${DataService.WEAPON_CLASSES.MISSILE}`]:
        {
            label: "Missile Resistance",
            filters: [
                {
                    abilityType: DataService.ABILITY_TYPES.INCREASE_RESISTENCE,
                    weapon_classes: [DataService.WEAPON_CLASSES.MISSILE],
                },
            ],
        },
    [`${DataService.ABILITY_TYPES.INCREASE_RESISTENCE}__${DataService.WEAPON_CLASSES.KINETIC}`]:
        {
            label: "Kinetic Resistance",
            filters: [
                {
                    abilityType: DataService.ABILITY_TYPES.INCREASE_RESISTENCE,
                    weapon_classes: [DataService.WEAPON_CLASSES.KINETIC],
                },
            ],
        },

    [DataService.ABILITY_TYPES.INCREASE_HP]: {
        label: "HP",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_HP,
            },
            {
                abilityType: DataService.ABILITY_TYPES.REDUCE_DAMAGE,
                variants: [DataService.RESISTANCE_TYPES.HULL],
            },
        ],
    },
    [DataService.ABILITY_TYPES.INCREASE_SHIELD]: {
        label: "Shield",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_SHIELD,
            },
            {
                abilityType: DataService.ABILITY_TYPES.REDUCE_DAMAGE,
                variants: [DataService.RESISTANCE_TYPES.SHIELDS],
            },
        ],
    },
    [DataService.ABILITY_TYPES.INCREASE_ACCURACY]: {
        label: "Accuracy",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_ACCURACY,
            },
        ],
    },
    [DataService.ABILITY_TYPES.INCREASE_EVADE]: {
        label: "Evade",
        filters: [
            {
                abilityType: DataService.ABILITY_TYPES.INCREASE_EVADE,
            },
        ],
    },
};

const builderStore = useBuilderStore();
const userStore = useUserStore();

const sortOptions = Object.entries(sortMap).map(([key, value]) => ({
    key,
    ...value,
}));
const statAbilityShips = ref([]);

const selectedOptions = ref([]);

const allLoaded = ref(false);

const searchText = ref("");

const selectedShipClasses = ref([]);

const selectedShipIds = ref([]);

const excludedShipIds = ref([]);

window.sortMapTrack = {};

const onSelectShip = (id_user_ship) => {
    if (!isSelected(id_user_ship)) {
        selectedShipIds.value.push(id_user_ship);
    }
};
const onExcludeShip = (id_user_ship) => {
    if (!isExcluded(id_user_ship)) {
        excludedShipIds.value.push(id_user_ship);
    }
    if (isSelected(id_user_ship)) {
        onRemoveSelectedShip(id_user_ship);
    }
};

const onRemoveSelectedShip = (id_user_ship) => {
    const index = selectedShipIds.value.indexOf(id_user_ship);
    if (index > -1) {
        selectedShipIds.value.splice(index, 1);
    }
};

const onRemoveExcludedShip = (id_user_ship) => {
    const index = excludedShipIds.value.indexOf(id_user_ship);
    if (index > -1) {
        excludedShipIds.value.splice(index, 1);
    }
};

const isSelected = (id_user_ship) => {
    return selectedShipIds.value.includes(id_user_ship);
};

const isExcluded = (id_user_ship) => {
    return excludedShipIds.value.includes(id_user_ship);
};

const onClickLogout = () => {
    userStore.logout();
};

const getShipOptionValue = (statShip, option) => {
    // map each filter and join
    const val = option.filters.map((filter, i) => {
        if (filter.slotStrength) {
            return sum(
                filter.sizes.map(
                    (size) =>
                        statShip.ship.slotStrengths[filter.slotStrength][size]
                )
            );
        } else if (filter.shipField) {
            return statShip.ship[filter.shipField];
        } else if (filter.userShipField) {
            return statShip[filter.userShipField];
        } else if (filter.abilityType) {
            const shipTotals = statShip.shipTotals.filter((totalObj) => {
                return totalObj.abilityType === filter.abilityType;
            });

            let percent = 0;
            let number = 0;
            let formula = 0;

            shipTotals.forEach((shipTotal) => {
                const variantsMatched = filter.variants?.length
                    ? filter.variants.every((v) =>
                          shipTotal.variants.includes(v)
                      )
                    : true;
                const weaponClassesMatch = filter.weapon_classes
                    ? filter.weapon_classes.every((wc) =>
                          shipTotal.source.ability.weapon_classes.includes(wc)
                      )
                    : true;

                if (variantsMatched && weaponClassesMatch) {
                    if (shipTotal.amountType === "percent") {
                        percent += shipTotal.stackedValue;
                    } else if (shipTotal.amountType === "number") {
                        number += shipTotal.stackedValue;
                    } else if (shipTotal.amountType === "formula") {
                        formula += 1;
                    }
                }
            });

            return percent || number || formula;
        } else if (filter.mapTo) {
            if (filter.mapTo === "class_sort") {
                return statShip.ship.ship_class.sort;
            }
        }
    });

    return val;
};

const shipClassOptions = computed(() => {
    return builderStore.shipClasses.map((shipClass) => ({
        label: shipClass.name,
        value: shipClass.id_class,
    }));
});

const sortedShips = computed(() => {
    window.sortMapTrack = {};
    const arr = [...statAbilityShips.value].filter((userShip) => {
        let okay = true;

        if (okay && excludedShipIds.value.length) {
            okay = !excludedShipIds.value.includes(userShip.id_user_ship);
        }

        if (okay && searchText.value.length > 0) {
            const searched = searchText.value.toLowerCase();
            okay =
                userShip.ship.name.toLowerCase().includes(searched) ||
                (userShip.name &&
                    userShip.name.toLowerCase().includes(searched));
        }

        if (okay && selectedShipClasses.value.length) {
            const selectedIds = selectedShipClasses.value.map((sc) => sc.value);
            okay = selectedIds.includes(userShip.ship.id_class);
        }

        return okay;
    });

    console.time("SortComputed");

    let match = -1;
    arr.sort((a, b) => {
        match++;
        const options = cloneDeep(selectedOptions.value);

        window.sortMapTrack[match] = {};
        const aSelected = isSelected(a.id_user_ship);
        const bSelected = isSelected(b.id_user_ship);

        if (aSelected !== bSelected) {
            return aSelected ? -1 : 1;
        }
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const aOptionValues = getShipOptionValue(a, option);
            const bOptionValues = getShipOptionValue(b, option);

            window.sortMapTrack[match][i] = [];

            window.sortMapTrack[match][i].push({
                sortKey: option.key,
                aId: a.id_user_ship + " " + a.ship.name,
                bId: b.id_user_ship + " " + b.ship.name,
                a: aOptionValues,
                b: bOptionValues,
            });

            for (let k = 0; k < aOptionValues.length; k++) {
                const aOptionValue = aOptionValues[k];
                const bOptionValue = bOptionValues[k];

                if (aOptionValue !== bOptionValue) {
                    if (aOptionValue > bOptionValue) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            }
        }
        return 0;
    });

    console.timeEnd("SortComputed");
    return arr;
});

const selectedShips = computed(() => {
    return selectedShipIds.value.map((id_user_ship) => {
        const found = builderStore.userShips.find(
            (userShip) => userShip.id_user_ship === id_user_ship
        );
        return {
            id_user_ship,
            name: found.ship.name,
            level: found.level,
            chip_level: found.chip_level,
        };
    });
});

const excludedShips = computed(() => {
    return excludedShipIds.value.map((id_user_ship) => {
        const found = builderStore.userShips.find(
            (userShip) => userShip.id_user_ship === id_user_ship
        );
        return {
            id_user_ship,
            name: found.ship.name,
            level: found.level,
            chip_level: found.chip_level,
        };
    });
});

onMounted(async () => {
    const def1 = builderStore.ships.length
        ? Promise.resolve()
        : builderStore.loadShips();
    const def2 = builderStore.userShips.length
        ? Promise.resolve()
        : builderStore.loadUserShips();
    const def3 = builderStore.shipClasses.length
        ? Promise.resolve()
        : builderStore.loadShipClasses();

    await Promise.all([def1, def2, def3]).then(() => {
        allLoaded.value = true;
    });

    console.time("onMounted");

    statAbilityShips.value = [...builderStore.userShips]
        // .filter((userShip) => userShip.id_user_ship === 132)
        .map((userShip) => {
            const { totalStats: shipTotalStats } =
                getUserShipParsedAbilityStats(userShip, false);
            const { totalStats: flagTotalStats } =
                getUserShipParsedAbilityStats(userShip, true);

            const shipTotals = sumFleetTotalStats(null, shipTotalStats).map(
                (row) => {
                    return {
                        ...row,
                        ...summedStatsTotalToText(row, {
                            shipClasses: builderStore.shipClasses,
                            withConditions: true,
                        }),
                    };
                }
            );

            augmentShipTotalStats(shipTotals);

            const flagTotals = sumFleetTotalStats(null, flagTotalStats).map(
                (row) => {
                    return {
                        ...row,
                        ...summedStatsTotalToText(row, {
                            shipClasses: builderStore.shipClasses,
                            withConditions: true,
                        }),
                    };
                }
            );

            augmentShipTotalStats(flagTotals);

            const attackTotals = [];
            const penetrationTotals = [];
            const armorTotals = [];
            const resistanceTotals = [];
            const hpTotals = [];
            const shieldTotals = [];
            const unsortedTotals = [];

            const matchVariantColumn = (col, row) => {
                if (typeof col === "string") {
                    return row.abilityType === col;
                } else if (typeof col === "object" && col.length === 2) {
                    return (
                        row.abilityType === col[0] &&
                        row.variants.includes(col[1])
                    );
                }
                return false;
            };

            shipTotals.forEach((row) => {
                if (attackColumns.includes(row.abilityType)) {
                    attackTotals.push(row);
                } else if (
                    armorColumns.some((col) => matchVariantColumn(col, row))
                ) {
                    armorTotals.push(row);
                } else if (resistanceColumns.includes(row.abilityType)) {
                    resistanceTotals.push(row);
                } else if (
                    hpColumns.some((col) => matchVariantColumn(col, row))
                ) {
                    hpTotals.push(row);
                } else if (
                    shieldColumns.some((col) => matchVariantColumn(col, row))
                ) {
                    shieldTotals.push(row);
                } else if (penetrationColumns.includes(row.abilityType)) {
                    penetrationTotals.push(row);
                } else {
                    unsortedTotals.push(row);
                }
            });

            return {
                ...userShip,
                shipTotals,
                flagTotals,
                attackTotals,
                penetrationTotals,
                armorTotals,
                resistanceTotals,
                hpTotals,
                shieldTotals,
                unsortedTotals,
            };
        });

    console.timeEnd("onMounted");
});
</script>

<template>
    <BuilderLayout>
        <div class="flex w-full justify-end p-4">
            <router-link to="/" class="banner__link" @click="onClickLogout">
                Logout
            </router-link>
        </div>

        <div class="ships-viewer p-6 bg-white mx-8">
            <div class="controls mb-10">
                <div class="flex gap-x-4 mb-4">
                    <div class="w-1/2">
                        <div>Select Sort Options</div>
                        <div>
                            <VSelect
                                :options="sortOptions"
                                multiple
                                v-model="selectedOptions"
                            />
                        </div>
                    </div>
                    <div class="w-1/2">
                        <div>Filter by ship class</div>
                        <div>
                            <VSelect
                                :options="shipClassOptions"
                                multiple
                                v-model="selectedShipClasses"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex gap-x-4 mb-4">
                    <div class="w-1/3">
                        <div>Search ship name/nickname</div>
                        <div class="input-group flex items-center gap-x-2">
                            <div class="grow">
                                <input
                                    type="text"
                                    class="input"
                                    placeholder="Search ships"
                                    v-model="searchText"
                                />
                            </div>
                            <div class="shrink" v-if="searchText.length">
                                <button
                                    class="btn btn-red bg-red"
                                    @click="searchText = ''"
                                >
                                    <TimesIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="w-1/3">
                        <div>Selected Ships</div>
                        <div class="flex flex-wrap gap-3">
                            <div
                                class="bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
                                v-for="ship in selectedShips"
                                :key="ship.id_user_ship"
                                @click="onRemoveSelectedShip(ship.id_user_ship)"
                            >
                                {{ ship.chip_level }}*
                                {{ ship.name }}
                                L{{ ship.level }}
                            </div>
                        </div>
                    </div>
                    <div class="w-1/3">
                        <div>Excluded Ships</div>
                        <div class="flex flex-wrap gap-3">
                            <div
                                class="bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
                                v-for="ship in excludedShips"
                                :key="ship.id_user_ship"
                                @click="onRemoveExcludedShip(ship.id_user_ship)"
                            >
                                {{ ship.chip_level }}*
                                {{ ship.name }}
                                L{{ ship.level }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-wrapper">
                <table class="table w-full" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ship</th>
                            <th>Slot Strength</th>
                            <th>Attack</th>
                            <th>Armor / Resist</th>
                            <th>HP / Shield</th>
                            <th>Flagship</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(userShip, index) in sortedShips"
                            :key="userShip.id_user_ship"
                            :data-index="index"
                            :class="{
                                selected: isSelected(userShip.id_user_ship),
                            }"
                        >
                            <td>
                                <div>
                                    <button
                                        class="btn btn-sm bg-emerald-600 text-white select-ship"
                                        @click="
                                            onSelectShip(userShip.id_user_ship)
                                        "
                                    >
                                        <CheckIcon />
                                    </button>
                                </div>
                                <div>
                                    <button
                                        class="btn btn-sm bg-red-600 text-white exclude-ship"
                                        @click="
                                            onExcludeShip(userShip.id_user_ship)
                                        "
                                    >
                                        <TimesIcon />
                                    </button>
                                </div>
                            </td>
                            <td>
                                <div class="text-xs flex gap-x-2">
                                    <div>
                                        {{ userShip.ship.ship_class.name }}
                                    </div>
                                    <div class="text-red-600 font-bold">
                                        {{ userShip.ship.energy }}
                                    </div>
                                </div>
                                <div class="flex gap-x-2 leading-none">
                                    <div>
                                        {{ userShip.ship.name }}
                                    </div>
                                    <div class="pt-[4px]">
                                        <Chips
                                            :total="userShip.ship.chipCount"
                                            :chipLevel="userShip.chip_level"
                                            height="10px"
                                        />
                                    </div>
                                </div>
                            </td>
                            <td data-col="slots">
                                Armor
                                <div class="flex gap-x-2 mb-2">
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            S
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .armor.s
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            M
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .armor.m
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            L
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .armor.l
                                            }}
                                        </div>
                                    </div>
                                </div>

                                Units
                                <div class="flex gap-x-2 mb-2">
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            S
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths.unit
                                                    .s
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            M
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths.unit
                                                    .m
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            L
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths.unit
                                                    .l
                                            }}
                                        </div>
                                    </div>
                                </div>

                                Weapons
                                <div class="flex gap-x-2">
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            S
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .weapon.s
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            M
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .weapon.m
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            L
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .weapon.l
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td data-col="damage">
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.attackTotals"
                                    :key="index"
                                    :total="total"
                                />
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.penetrationTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.armorTotals"
                                    :key="index"
                                    :total="total"
                                />
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.resistanceTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(total, index) in userShip.hpTotals"
                                    :key="index"
                                    :total="total"
                                />
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.shieldTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.flagTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </BuilderLayout>
</template>

<style lang="less" scoped>
.table {
    th {
        text-align: left;
        border-bottom: solid 2px #888;
    }

    td {
        padding: 10px;
    }

    tr:nth-child(2n) {
        td {
            background: #eee;
        }
    }

    tr {
        &.selected {
            td {
                background: #beecdd;
                .select-ship {
                    display: none;
                }
            }
        }
    }
}

.controls {
    :deep(.v-select, .input) {
        background: #fff;
        color: #232323;
    }

    :deep(.vs__dropdown-menu, .input) {
        background: #fff;
    }

    :deep(.vs__selected, .input) {
        color: #232323;
    }
    :deep(.vs__dropdown-option--selected) {
        display: none;
    }
}
</style>
