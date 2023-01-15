import { sum } from "lodash";
import { toRaw } from "vue";
import DataService from "../services/DataService";
import {
    abilityHasQualifiers,
    getAbilityTextParser,
} from "./abilityTextParser";
import { parseUserShipAbilities } from "./fleet";

export const parseShipSlotCounts = (ship) => {
    if (ship.slotCounts) {
        return ship.slotCounts;
    }

    const slotTypes = DataService.SLOT_TYPES;
    const sizes = DataService.SIZES;

    const slotCounts = {
        [slotTypes.WEAPON]: {
            total: 0,
            [sizes.S]: 0,
            [sizes.M]: 0,
            [sizes.L]: 0,
        },
        [slotTypes.ARMOR]: {
            total: 0,
            [sizes.S]: 0,
            [sizes.M]: 0,
            [sizes.L]: 0,
        },
        [slotTypes.UNIT]: {
            total: 0,
            [sizes.S]: 0,
            [sizes.M]: 0,
            [sizes.L]: 0,
        },
    };

    ship.ship_slots.forEach((slot) => {
        slotCounts[slot.type].total += parseInt(slot.amount);
        slotCounts[slot.type][slot.size] += parseInt(slot.amount);
    });

    ship.slotCounts = slotCounts;

    return slotCounts;
};

export const parseShipSlotStrengths = (ship) => {
    if (ship.slotStrengths) {
        return ship.slotStrengths;
    }
    const slotCounts = parseShipSlotCounts(ship);
    const sizes = DataService.SIZES;

    const slotStrengths = {};

    Object.entries(slotCounts).forEach(([slotType, counts]) => {
        slotStrengths[slotType] = {
            [sizes.S]: counts[sizes.S] * 1,
            [sizes.M]: counts[sizes.M] * 2,
            [sizes.L]: counts[sizes.L] * 4,
        };

        slotStrengths[slotType].total = sum(
            Object.values(slotStrengths[slotType])
        );
    });

    ship.slotStrengths = slotStrengths;

    return slotStrengths;
};

export const getShipChipsCount = (ship) => {
    const chipsMap = {};

    return ship.abilities.reduce((total, ability) => {
        if (ability.location.includes("chip_")) {
            if (!chipsMap[ability.location]) {
                chipsMap[ability.location] = 1;
                return total + 1;
            }
        }

        return total;
    }, 0);
};

export const populateUserShipAbilityData = (userShip, { shipClasses }) => {
    const parsedAbilities = parseUserShipAbilities(
        userShip,
        (parsedAbility) => {
            const parser = getAbilityTextParser(
                parsedAbility.ability,
                {
                    shipClasses,
                },
                false
            );

            return {
                affectType: parser.affectType,
                abilityTypeName: parser.abilityTypeName,
                amountDescription: parser.amountDescription,
                fullDescription: parser.fullDescription,
                abilityTypeCategory: parser.abilityTypeCategory,
                conditionsDescription: parser.conditionsDescription,
                abilityQualifiiers: parser.abilityQualifiiers,
                amount: parser.amount,
                amountIsFormula: parsedAbility.ability.amounts.some(
                    (a) => a.type === DataService.FORMULA_ITEM_TYPES.FORMULA
                ),
                hasConditions: parsedAbility.ability.conditions.length > 0,
                hasQualifiers: abilityHasQualifiers(parsedAbility.ability),
            };
        }
    );

    userShip.parsedAbilities = parsedAbilities;

    return parsedAbilities;
};
