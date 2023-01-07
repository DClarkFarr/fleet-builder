import DataService from "../services/DataService";

export const parseShipSlotCounts = (ship) => {
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

    return slotCounts;
};
