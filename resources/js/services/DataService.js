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

    static REPEAT_TYPES = {
        SECONDS: "seconds",
        ATTACKS: "attacks",
    };

    static AMOUNT_TYPES = {
        NUMBER: "number",
        PERCENT: "percent",
        FORMULA: "formula",
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

    static SHIP_COLUMNS = {
        LEVEL: "level",
        TOTAL_WEAPON_DAMAGE: "all_weapon_damage",
        BEAM_WEAPON_DAMAGE: "beam_weapon_damage",
        MISSILE_WEAPON_DAMAGE: "missile_weapon_damage",
        KINETIC_WEAPON_DAMAGE: "kinetic_weapon_damage",
        TOTAL_RESISTANCE: "all_resistance",
        KINETIC_RESISTANCE: "kinetic_resistance",
        MISSILE_RESISTANCE: "missile_resistance",
        BEAM_RESISTANCE: "beam_resistance",
        TOTAL_SHIELDS: "all_shields",
    };

    static FORMULA_ITEM_TYPES = {
        NUMBER: "number",
        COLUMN: "column",
        FORMULA: "formula",
    };

    static FORMULA_ITEM_OPERATORS = {
        ADD: "+",
        SUBTRACT: "-",
        MULTIPLY: "*",
        DIVIDE: "/",
    };

    static FLEET_LOCATIONS = {
        FLEET_1: "fleet_1",
        FLEET_2: "fleet_2",
        FLEET_3: "fleet_3",
        FLEET_4: "fleet_4",
        FLEET_5: "fleet_5",
        FLEET_6: "fleet_6",
    };

    static getFleetLocations() {
        return [
            {
                name: "Fleet 1",
                slug: DataService.FLEET_LOCATIONS.FLEET_1,
            },
            {
                name: "Fleet 2",
                slug: DataService.FLEET_LOCATIONS.FLEET_2,
            },
            {
                name: "Fleet 3",
                slug: DataService.FLEET_LOCATIONS.FLEET_3,
            },
            {
                name: "Fleet 4",
                slug: DataService.FLEET_LOCATIONS.FLEET_4,
            },
            {
                name: "Fleet 5",
                slug: DataService.FLEET_LOCATIONS.FLEET_5,
            },
            {
                name: "Fleet 6",
                slug: DataService.FLEET_LOCATIONS.FLEET_6,
            },
        ];
    }

    static getFormulaOperators() {
        return [
            {
                name: "Add",
                slug: DataService.FORMULA_ITEM_OPERATORS.ADD,
            },
            {
                name: "Subtract",
                slug: DataService.FORMULA_ITEM_OPERATORS.SUBTRACT,
            },
            {
                name: "Multiply",
                slug: DataService.FORMULA_ITEM_OPERATORS.MULTIPLY,
            },
            {
                name: "Divide",
                slug: DataService.FORMULA_ITEM_OPERATORS.DIVIDE,
            },
        ];
    }
    static getFormulaItemTypes() {
        return [
            {
                name: "Number",
                slug: DataService.FORMULA_ITEM_TYPES.NUMBER,
            },
            {
                name: "Column",
                slug: DataService.FORMULA_ITEM_TYPES.COLUMN,
            },
            {
                name: "Formula",
                slug: DataService.FORMULA_ITEM_TYPES.FORMULA,
            },
        ];
    }

    static getShipColumns() {
        return [
            {
                name: "Ship Level",
                slug: DataService.SHIP_COLUMNS.LEVEL,
            },
            {
                name: "Total Weapon Damage",
                slug: DataService.SHIP_COLUMNS.TOTAL_WEAPON_DAMAGE,
            },
            {
                name: "Beam Weapon Damage",
                slug: DataService.SHIP_COLUMNS.BEAM_WEAPON_DAMAGE,
            },
            {
                name: "Missile Weapon Damage",
                slug: DataService.SHIP_COLUMNS.MISSILE_WEAPON_DAMAGE,
            },
            {
                name: "Kinetic Weapon Damage",
                slug: DataService.SHIP_COLUMNS.KINETIC_WEAPON_DAMAGE,
            },
            {
                name: "Total Resistance",
                slug: DataService.SHIP_COLUMNS.TOTAL_RESISTANCE,
            },
            {
                name: "Kinetic Resistance",
                slug: DataService.SHIP_COLUMNS.KINETIC_RESISTANCE,
            },
            {
                name: "Missile Resistance",
                slug: DataService.SHIP_COLUMNS.MISSILE_RESISTANCE,
            },
            {
                name: "Beam Resistance",
                slug: DataService.SHIP_COLUMNS.BEAM_RESISTANCE,
            },
            {
                name: "Total Shields",
                slug: DataService.SHIP_COLUMNS.TOTAL_SHIELDS,
            },
        ];
    }

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

    static getRepeatTypes() {
        return [
            {
                name: "Seconds",
                slug: DataService.REPEAT_TYPES.SECONDS,
            },
            {
                name: "Attacks",
                slug: DataService.REPEAT_TYPES.ATTACKS,
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
                category: "Damage",
            },
            {
                name: "Increase Resistence",
                slug: DataService.ABILITY_TYPES.INCREASE_RESISTENCE,
                category: "Resistance",
            },
            {
                name: "Increase Weapon Damage",
                slug: DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
                weapons: true,
                category: "Damage",
            },
            {
                name: "Increase Penetration",
                slug: DataService.ABILITY_TYPES.INCREASE_PENETRATION,
                weapons: true,
                category: "Penetration",
            },
            {
                name: "Increase HP",
                slug: DataService.ABILITY_TYPES.INCREASE_HP,
                category: "HP",
            },
            {
                name: "Increase Armor",
                slug: DataService.ABILITY_TYPES.INCREASE_ARMOR,
                weapons: true,
                category: "Armor",
            },
            {
                name: "Increase Accuracy",
                slug: DataService.ABILITY_TYPES.INCREASE_ACCURACY,
                weapons: true,
                category: "Accuracy",
            },
            {
                name: "Increase Evade",
                slug: DataService.ABILITY_TYPES.INCREASE_EVADE,
                category: "Evade",
            },
            {
                name: "Increase Shield",
                slug: DataService.ABILITY_TYPES.INCREASE_SHIELD,
                weapons: true,
                category: "Shield",
            },
            {
                name: "Increase Movement Speed",
                slug: DataService.ABILITY_TYPES.INCREASE_MOVEMENT_SPEED,
                category: "Movement",
            },
            {
                name: "Increase FTL Speed",
                slug: DataService.ABILITY_TYPES.INCREASE_FTL_SPEED,
                category: "FTL",
            },
            {
                name: "Extra Attack",
                slug: DataService.ABILITY_TYPES.EXTRA_ATTACK,
                weapons: true,
                repeats: true,
                category: "Extra Attack",
            },
            {
                name: "Increase Attack Speed",
                slug: DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED,
                weapons: true,
                category: "Attack Speed",
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
                name: "Formula",
                slug: DataService.AMOUNT_TYPES.FORMULA,
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
