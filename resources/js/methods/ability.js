import { watch } from "vue";
import DataService from "../services/DataService";
import pluralize from "pluralize";

const typesByAffect = Object.entries(
    DataService.getAbilityTypesByAffect()
).reduce((obj, [key, vals]) => {
    vals.forEach((val) => {
        obj[val] = key;
    });
    return obj;
}, {});

const abilityTypes = DataService.getAbilityTypes();
const amountTypes = DataService.AMOUNT_TYPES;

const parseAgainstClasses = (ability, { shipClasses }) => {
    if (!ability.for_class_ids.length) {
        return "";
    }

    const classNames = ability.for_class_ids
        .map((id) => {
            const name = shipClasses.find((c) => c.id_class === id)?.name;
            return name ? pluralize.plural(name) : false;
        })
        .filter((c) => !!c);

    return `against enemy ${joinAnd(classNames)}`;
};

const parseForClasses = (ability, { shipClasses }) => {
    if (!ability.applies_to_fleet) {
        return "";
    }

    if (!ability.for_class_ids.length) {
        return "for all ships in fleet";
    }

    const classNames = ability.for_class_ids
        .map((id) => {
            const name = shipClasses.find((c) => c.id_class === id)?.name;
            return name ? pluralize.plural(name) : false;
        })
        .filter((c) => !!c);

    return `for ${joinAnd(classNames)} in fleet`;
};

const parseAmountDescription = (ability) => {
    const lines = {
        [amountTypes.NUMBER]: "by {amount}",
        [amountTypes.PERCENT]: "by {amount}%",
        [amountTypes.ATTACKS]: "every {amount} attacks",
        [amountTypes.SECONDS]: "every {amount} seconds",
    };

    const line = lines[ability.amount_type];
    return parseText(line, {
        amount: ability.amount,
    });
};

const joinAnd = (arr) => {
    if (arr.length > 1) {
        const last = arr.pop();
        return arr.join(", ") + " and " + last;
    }
    return arr.join(", ");
};

const parseVariantDescription = (ability, location = "to") => {
    if (!ability.variants.length) {
        return "";
    }
    const lines = {
        to: "to {variants}",
    };

    const line = lines[location];

    return parseText(line, {
        variants: joinAnd(ability.variants),
    });
};

const parseText = (str, pairs, fallback = "") => {
    const pattern = /\{\s*(\w+)\s*\}/gm;
    const r = str.matchAll(pattern);
    const values = [];

    let m;
    while ((m = r.next())) {
        if (m.done) break;
        values.push(m.value);
    }

    let parsed = str;

    values.forEach((v) => {
        const [full, slug] = v;
        const value = pairs[slug] || fallback;
        parsed = parsed.replace(full, value);
    });

    return parsed;
};

const parseDurationDescription = (ability) => {
    if (!ability.duration_type) {
        return "";
    }

    const lines = {
        [DataService.DURATION_TYPES.ATTACKS]: "for the first {amount} attacks",
        [DataService.DURATION_TYPES.SECONDS]: "for the first {amount} seconds",
    };

    const line = lines[ability.duration_type];

    return parseText(line, {
        amount: ability.duration,
    });
};

const parseCondition = (condition, { shipClasses }) => {
    if (condition.type === DataService.CONDITION_TYPES.id_class) {
        const operators = {
            [DataService.OPERATORS.EQUALS]: `there {verb} {number} {classes}`,
            [DataService.OPERATORS
                .GREATER]: `there {verb} at least {number} {classes}`,
            [DataService.OPERATORS
                .LESS]: `there {verb} less than {number} {classes}`,
        };

        const operatorLine = operators[condition.operator];
        const verb = condition.value === 1 ? "is" : "are";
        const number = condition.value;
        const classes = condition.select
            .map((id) => {
                const name = shipClasses.find((c) => c.id_class === id)?.name;
                return name ? pluralize.plural(name) : false;
            })
            .filter((c) => !!c);

        return parseText(operatorLine, {
            verb,
            number,
            classes: joinAnd(classes),
        });
    }

    return "";
};

const parseConditionsDescription = (ability, { shipClasses }) => {
    if (!ability.conditions.length) {
        return "";
    }

    const conditions = ability.conditions.map((c) => {
        return parseCondition(c, { shipClasses });
    });

    return `when ${joinAnd(conditions)} in the fleet`;
};

class AbilityParser {
    // data = {
    //     affectType: null,
    // }
    constructor(ability, { shipClasses }) {
        this.shipClasses = shipClasses;
        watch(
            ability,
            () => {
                this.ability = { ...ability };
            },
            {
                immediate: true,
            }
        );
    }

    get affectType() {
        return typesByAffect[this.ability.type];
    }

    get abilityTypeName() {
        return abilityTypes.find((at) => at.slug === this.ability.type)?.name;
    }

    get amountDescription() {
        return parseAmountDescription(this.ability);
    }

    get forClasses() {
        return parseForClasses(this.ability, {
            shipClasses: this.shipClasses,
        });
    }

    get toVariantDescription() {
        return parseVariantDescription(this.ability, "to");
    }

    get durationDescription() {
        return parseDurationDescription(this.ability);
    }

    get againstClasses() {
        return parseAgainstClasses(this.ability, {
            shipClasses: this.shipClasses,
        });
    }

    get conditionsDescription() {
        return parseConditionsDescription(this.ability, {
            shipClasses: this.shipClasses,
        });
    }

    get fullDescription() {
        /*
        'location',
        'type',
        'variants',
        'amount_type',
        'amount',
        'weapon_classes',
        'weapon_sizes',
        'notes',
        'duration_type',
        'duration',
        'applies_to_fleet',
        'for_class_ids',
        'target_class_ids',
        'conditions',
        */

        const template =
            "{abilityTypeName} {toVariantDescription} {forClasses} {amountDescription} {durationDescription} {againstClasses} {conditionsDescription}";

        const parsedText = parseText(template, {
            abilityTypeName: this.abilityTypeName,
            amountDescription: this.amountDescription,
            forClasses: this.forClasses,
            toVariantDescription: this.toVariantDescription,
            durationDescription: this.durationDescription,
            againstClasses: this.againstClasses,
            conditionsDescription: this.conditionsDescription,
        });

        return `${parsedText.replace(/\s{2,}/gm, " ").trim()}.`;
    }
}
export const getAbilityParser = (ability, data) => {
    const ap = new AbilityParser(ability, data);

    return ap;
};
