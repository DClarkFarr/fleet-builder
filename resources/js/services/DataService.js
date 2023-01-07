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
        ARMOR: "armor",
    };

    static CONDITION_TYPES = {
        id_class: "id_class",
    };

    static OPERATORS = {
        EQUALS: "=",
        GREATER: ">",
        LESS: "<",
    };

    static ABILITY_AFFECTS = {
        ATTACK: "attack",
        DEFENSE: "defense",
        PASSIVE: "passive",
    };

    static ABILITY_TYPES = {
        REDUCE_DAMAGE: "reduce_damage",
        INCREASE_RESISTENCE: "increase_resistence",
        INCREASE_WEAPON_DAMAGE: "increase_weapon_damage",
        INCREASE_PENETRATION: "increase_penetration",
        INCREASE_HP: "increase_hp",
        INCREASE_ARMOR: "increase_armor",
        INCREASE_ACCURACY: "increase_accuracy",
        INCREASE_EVADE: "increase_evade",
        INCREASE_SHIELD: "increase_shield",
        INCREASE_MOVEMENT_SPEED: "increase_movement_speed",
        INCREASE_FTL_SPEED: "increase_ftl_speed",
        EXTRA_ATTACK: "extra_attack",
        INCREASE_ATTACK_SPEED: "increase_attack_speed",
    };

    static ABILITY_LOCATIONS = {
        ABILITY_1: "ability_1",
        ABILITY_2: "ability_2",
        ABILITY_3: "ability_3",
        FLAGSHIP_ABILITY: "flagship_ability",
        CHIP_1: "chip_1",
        CHIP_2: "chip_2",
        CHIP_3: "chip_3",
        CHIP_4: "chip_4",
        CHIP_5: "chip_5",
        CHIP_6: "chip_6",
    };

    static getAbilityAffects() {
        return [
            {
                name: "Attack",
                slug: DataService.ABILITY_AFFECTS.ATTACK,
            },
            {
                name: "Defense",
                slug: DataService.ABILITY_AFFECTS.DEFENSE,
            },
            {
                name: "Passive",
                slug: DataService.ABILITY_AFFECTS.PASSIVE,
            },
        ];
    }

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
        return [
            {
                name: "S",
                slug: DataService.SIZES.S,
            },
            {
                name: "M",
                slug: DataService.SIZES.M,
            },
            {
                name: "L",
                slug: DataService.SIZES.L,
            },
        ];
    }

    static getWeaponClasses() {
        return [
            {
                name: "Beam",
                slug: DataService.WEAPON_CLASSES.BEAM,
            },
            {
                name: "Missile",
                slug: DataService.WEAPON_CLASSES.MISSILE,
            },
            {
                name: "Kinetic",
                slug: DataService.WEAPON_CLASSES.KINETIC,
            },
        ];
    }

    static getSlotTypes() {
        return [
            {
                name: "Weapon",
                slug: DataService.SLOT_TYPES.WEAPON,
            },
            {
                name: "Armor",
                slug: DataService.SLOT_TYPES.ARMOR,
            },
            {
                name: "Unit",
                slug: DataService.SLOT_TYPES.UNIT,
            },
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
                slug: DataService.ABILITY_LOCATIONS.ABILITY_1,
                isChip: false,
            },
            {
                name: "Ability 2",
                slug: DataService.ABILITY_LOCATIONS.ABILITY_2,
                isChip: false,
            },
            {
                name: "Ability 3",
                slug: DataService.ABILITY_LOCATIONS.ABILITY_3,
                isChip: false,
            },
            {
                name: "Flagship Ability",
                slug: DataService.ABILITY_LOCATIONS.FLAGSHIP_ABILITY,
                isChip: false,
            },
            {
                name: "Chip 1",
                slug: DataService.ABILITY_LOCATIONS.CHIP_1,
                isChip: true,
            },
            {
                name: "Chip 2",
                slug: DataService.ABILITY_LOCATIONS.CHIP_2,
                isChip: true,
            },
            {
                name: "Chip 3",
                slug: DataService.ABILITY_LOCATIONS.CHIP_3,
                isChip: true,
            },
            {
                name: "Chip 4",
                slug: DataService.ABILITY_LOCATIONS.CHIP_4,
                isChip: true,
            },
            {
                name: "Chip 5",
                slug: DataService.ABILITY_LOCATIONS.CHIP_5,
                isChip: true,
            },
            {
                name: "Chip 6",
                slug: DataService.ABILITY_LOCATIONS.CHIP_6,
                isChip: true,
            },
        ];
    }

    static getAbilityTypes() {
        return [
            {
                name: "Reduce Damage",
                slug: DataService.ABILITY_TYPES.REDUCE_DAMAGE,
            },
            {
                name: "Increase Resistence",
                slug: DataService.ABILITY_TYPES.INCREASE_RESISTENCE,
            },
            {
                name: "Increase Weapon Damage",
                slug: DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                weapons: true,
            },
            {
                name: "Increase Penetration",
                slug: DataService.ABILITY_TYPES.INCREASE_PENETRATION,
                weapons: true,
            },
            {
                name: "Increase HP",
                slug: DataService.ABILITY_TYPES.INCREASE_HP,
            },
            {
                name: "Increase Armor",
                slug: DataService.ABILITY_TYPES.INCREASE_ARMOR,
                weapons: true,
            },
            {
                name: "Increase Accuracy",
                slug: DataService.ABILITY_TYPES.INCREASE_ACCURACY,
            },
            {
                name: "Increase Evade",
                slug: DataService.ABILITY_TYPES.INCREASE_EVADE,
            },
            {
                name: "Increase Shield",
                slug: DataService.ABILITY_TYPES.INCREASE_SHIELD,
                weapons: true,
            },
            {
                name: "Increase Movement Speed",
                slug: DataService.ABILITY_TYPES.INCREASE_MOVEMENT_SPEED,
            },
            {
                name: "Increase FTL Speed",
                slug: DataService.ABILITY_TYPES.INCREASE_FTL_SPEED,
            },
            {
                name: "Extra Attack",
                slug: DataService.ABILITY_TYPES.EXTRA_ATTACK,
                weapons: true,
            },
            {
                name: "Increase Attack Speed",
                slug: DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED,
                weapons: true,
            },
        ];
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

    static getVariantsByAbilityType() {
        return {
            [DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE]: [
                DataService.RESISTANCE_TYPES.SHIELDS,
                DataService.RESISTANCE_TYPES.HULL,
                DataService.RESISTANCE_TYPES.ARMOR,
            ],
            [DataService.ABILITY_TYPES.REDUCE_DAMAGE]: [
                DataService.RESISTANCE_TYPES.SHIELDS,
                DataService.RESISTANCE_TYPES.HULL,
                DataService.RESISTANCE_TYPES.ARMOR,
            ],
            increase_resistence: [
                DataService.WEAPON_CLASSES.BEAM,
                DataService.WEAPON_CLASSES.MISSILE,
                DataService.WEAPON_CLASSES.KINETIC,
            ],
            increase_penetration: [
                DataService.RESISTANCE_TYPES.SHIELDS,
                DataService.RESISTANCE_TYPES.HULL,
                DataService.RESISTANCE_TYPES.ARMOR,
            ],
        };
    }

    static getAbilityTypesByAffect() {
        return {
            [DataService.ABILITY_AFFECTS.ATTACK]: [
                DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED,
                DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                DataService.ABILITY_TYPES.INCREASE_PENETRATION,
                DataService.ABILITY_TYPES.INCREASE_ACCURACY,
                DataService.ABILITY_TYPES.EXTRA_ATTACK,
            ],
            [DataService.ABILITY_AFFECTS.DEFENSE]: [
                DataService.ABILITY_TYPES.REDUCE_DAMAGE,
                DataService.ABILITY_TYPES.INCREASE_RESISTENCE,
                DataService.ABILITY_TYPES.INCREASE_HP,
                DataService.ABILITY_TYPES.INCREASE_ARMOR,
                DataService.ABILITY_TYPES.INCREASE_EVADE,
                DataService.ABILITY_TYPES.INCREASE_SHIELD,
            ],
            [DataService.ABILITY_AFFECTS.PASSIVE]: [
                DataService.ABILITY_TYPES.INCREASE_MOVEMENT_SPEED,
                DataService.ABILITY_TYPES.INCREASE_FTL_SPEED,
            ],
        };
    }
}
