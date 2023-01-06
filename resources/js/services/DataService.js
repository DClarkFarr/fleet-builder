export default class DataService {
    static getSizes() {
        return ["s", "m", "l"];
    }

    static getSlotTypes() {
        return ["weapon", "armor", "unit"];
    }

    static SLOT_TYPES = {
        WEAPON: "weapon",
        ARMOR: "armor",
        UNIT: "unit",
    };

    static getAbilityTypes() {
        return [
            {
                name: "Reduce Damage",
                slug: "reduce-damage",
            },
            {
                name: "Increase Resistence",
                slug: "increase-resistence",
            },
            {
                name: "Increase Weapon Damage",
                slug: "increase-weapon-damage",
            },
            {
                name: "Increase Penetration",
                slug: "increase-penetration",
            },
            {
                name: "Increase HP",
                slug: "increase-hp",
            },
            {
                name: "Increase Armor",
                slug: "increase-armor",
            },
            {
                name: "Increase Accuracy",
                slug: "increase-accuracy",
            },
            {
                name: "Increase Evade",
                slug: "increase-evade",
            },
            {
                name: "Increase Shield",
                slug: "increase-shield",
            },
            {
                name: "Increase Movement Speed",
                slug: "increase-movement-speed",
            },
            {
                name: "Increase FTL Speed",
                slug: "increase-ftl-speed",
            },
            {
                name: "Extra Attack",
                slug: "extra-attack",
            },
            {
                name: "Increase Attack Speed",
                slug: "increase-attack-speed",
            },
        ];
    }
}
