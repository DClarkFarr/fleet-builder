export default class DataService {
    static getSizes() {
        return ["s", "m", "l"];
    }

    static getWeaponClasses() {
        return ["beam", "missile", "kinetic"];
    }

    static getSlotTypes() {
        return ["weapon", "armor", "unit"];
    }

    static getDurationTypes() {
        return [
            {
                name: "Seconds",
                slug: "seconds",
            },
            {
                name: "Attacks",
                slug: "attacks",
            },
        ];
    }

    static SLOT_TYPES = {
        WEAPON: "weapon",
        ARMOR: "armor",
        UNIT: "unit",
    };

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
            reduce_damage: ["shields", "hull"],
            increase_resistence: ["missile", "beam", "kinetic"],
            increase_penetration: ["shield", "hull"],
        };
    }

    static getAmountTypes() {
        return [
            {
                name: "Number",
                slug: "number",
            },
            {
                name: "Percent",
                slug: "percent",
            },
            {
                name: "Seconds",
                slug: "seconds",
            },
            {
                name: "Attacks",
                slug: "attacks",
            },
        ];
    }
}
