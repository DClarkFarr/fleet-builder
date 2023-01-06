export default class DataService {
    static SLOT_TYPES = {
        WEAPON: "weapon",
        ARMOR: "armor",
        UNIT: "unit",
    };

    static SIZES = {
        S: "s",
        M: "m",
        L: "l",
    };

    static WEAPON_CLASSES = {
        BEAM: "beam",
        MISSILE: "missile",
        KINETIC: "kinetic",
    };

    static DURATION_TYPES = {
        SECONDS: "seconds",
        ATTACKS: "attacks",
    };

    static AMOUNT_TYPES = {
        NUMBER: "number",
        PERCENT: "percent",
        SECONDS: "seconds",
        ATTACKS: "attacks",
    };

    static RESISTANCE_TYPES = {
        SHIELDS: "shields",
        HULL: "hull",
    };

    static CONDITION_TYPES = {
        id_class: "id_class",
    };

    static OPERATORS = {
        EQUALS: "=",
        GREATER: ">",
        LESS: "<",
    };

    static getOperators() {
        return [
            {
                name: "Equals",
                slug: DataService.OPERATORS.EQUALS,
            },
            {
                name: "Greater Than",
                slug: DataService.OPERATORS.GREATER,
            },
            {
                name: "Less Than",
                slug: DataService.OPERATORS.LESS,
            },
        ];
    }

    static getSizes() {
        return [DataService.SIZES.S, DataService.SIZES.M, DataService.SIZES.L];
    }

    static getWeaponClasses() {
        return [
            DataService.WEAPON_CLASSES.BEAM,
            DataService.WEAPON_CLASSES.MISSILE,
            DataService.WEAPON_CLASSES.KINETIC,
        ];
    }

    static getSlotTypes() {
        return [
            DataService.SLOT_TYPES.WEAPON,
            DataService.SLOT_TYPES.ARMOR,
            DataService.SLOT_TYPES.UNIT,
        ];
    }

    static getConditionTypes() {
        return [
            {
                name: "Has Class",
                slug: DataService.CONDITION_TYPES.id_class,
            },
        ];
    }

    static getDurationTypes() {
        return [
            {
                name: "Seconds",
                slug: DataService.DURATION_TYPES.SECONDS,
            },
            {
                name: "Attacks",
                slug: DataService.DURATION_TYPES.ATTACKS,
            },
        ];
    }

    static getShipAbilityLocations() {
        return [
            {
                name: "Ability 1",
                slug: "ability_1",
                isChip: false,
            },
            {
                name: "Ability 2",
                slug: "ability_2",
                isChip: false,
            },
            {
                name: "Ability 3",
                slug: "ability_3",
                isChip: false,
            },
            {
                name: "Flagship Ability",
                slug: "flagship_ability",
                isChip: false,
            },
            {
                name: "Chip 1",
                slug: "chip_1",
                isChip: true,
            },
            {
                name: "Chip 2",
                slug: "chip_2",
                isChip: true,
            },
            {
                name: "Chip 3",
                slug: "chip_3",
                isChip: true,
            },
            {
                name: "Chip 4",
                slug: "chip_4",
                isChip: true,
            },
            {
                name: "Chip 5",
                slug: "chip_5",
                isChip: true,
            },
            {
                name: "Chip 6",
                slug: "chip_6",
                isChip: true,
            },
        ];
    }

    static getAbilityTypes() {
        return [
            {
                name: "Reduce Damage",
                slug: "reduce_damage",
            },
            {
                name: "Increase Resistence",
                slug: "increase_resistence",
            },
            {
                name: "Increase Weapon Damage",
                slug: "increase_weapon_damage",
                weapons: true,
            },
            {
                name: "Increase Penetration",
                slug: "increase_penetration",
            },
            {
                name: "Increase HP",
                slug: "increase_hp",
            },
            {
                name: "Increase Armor",
                slug: "increase_armor",
                weapons: true,
            },
            {
                name: "Increase Accuracy",
                slug: "increase_accuracy",
            },
            {
                name: "Increase Evade",
                slug: "increase_evade",
            },
            {
                name: "Increase Shield",
                slug: "increase_shield",
                weapons: true,
            },
            {
                name: "Increase Movement Speed",
                slug: "increase_movement_speed",
            },
            {
                name: "Increase FTL Speed",
                slug: "increase_ftl_speed",
            },
            {
                name: "Extra Attack",
                slug: "extra_attack",
                weapons: true,
            },
            {
                name: "Increase Attack Speed",
                slug: "increase_attack_speed",
                weapons: true,
            },
        ];
    }

    static getVariantsByAbilityType(abilityType) {
        return {
            reduce_damage: [
                DataService.RESISTANCE_TYPES.SHIELDS,
                DataService.RESISTANCE_TYPES.HULL,
            ],
            increase_resistence: [
                DataService.WEAPON_CLASSES.BEAM,
                DataService.WEAPON_CLASSES.MISSILE,
                DataService.WEAPON_CLASSES.KINETIC,
            ],
            increase_penetration: [
                DataService.RESISTANCE_TYPES.SHIELDS,
                DataService.RESISTANCE_TYPES.HULL,
            ],
        };
    }

    static getAmountTypes() {
        return [
            {
                name: "Number",
                slug: DataService.AMOUNT_TYPES.NUMBER,
            },
            {
                name: "Percent",
                slug: DataService.AMOUNT_TYPES.PERCENT,
            },
            {
                name: "Seconds",
                slug: DataService.AMOUNT_TYPES.SECONDS,
            },
            {
                name: "Attacks",
                slug: DataService.AMOUNT_TYPES.ATTACKS,
            },
        ];
    }
}
