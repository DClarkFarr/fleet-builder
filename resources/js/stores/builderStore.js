import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";
import apiClient from "../services/ApiClient";
import { useToast } from "vue-toastification";
import { cloneDeep } from "lodash";
import {
    parseFleetShipsAbilities,
    parseFleetBasicStats,
} from "../methods/fleet";
import {
    getShipChipsCount,
    parseShipSlotStrengths,
    populateUserShipAbilityData,
} from "../methods/ship";

import { getFleetsParsedAbilityStats } from "../methods/abilityStatParser";

const useBuilderStore = defineStore("builder", () => {
    const toast = useToast();
    const ships = ref([]);
    const isLoadingShips = ref(false);

    const shipClasses = ref([]);

    const userShips = ref([]);
    const isLoadingUserShips = ref(false);

    const workshops = ref([]);
    const isLoadingWorkshops = ref(false);

    const selectedWorkshopId = ref(null);

    const selectedFleets = ref([]);

    const populateUserShip = (userShip) => {
        populateShip(userShip.ship);

        populateUserShipAbilityData(userShip, {
            shipClasses: toRaw(shipClasses.value),
        });

        return userShip;
    };
    const populateShip = (ship) => {
        parseShipSlotStrengths(ship);
        ship.chipCount = getShipChipsCount(ship);

        return ship;
    };

    const setSelectedWorkshopId = (id_workshop) => {
        selectedWorkshopId.value = id_workshop;

        selectedFleets.value = [];

        loadWorkshopFleets(id_workshop);
    };

    const selectedFleetsAbilityLists = computed(() => {
        return selectedFleets.value.reduce((obj, fleet) => {
            obj[fleet.id_workshop_fleet] = fleet.parsedAbilities;
            return obj;
        }, {});
    });

    const selectedFleetsStats = computed(() => {
        return getFleetsParsedAbilityStats(selectedFleets.value);
    });

    const loadShips = async () => {
        isLoadingShips.value = true;

        await apiClient
            .get("data/ships")
            .then((response) => {
                return response.data.rows.map(populateShip);
            })
            .then((ss) => {
                ships.value = ss;
            });

        isLoadingShips.value = false;
    };

    const loadShipClasses = async () => {
        return apiClient.get("data/ships/classes").then((response) => {
            shipClasses.value = response.data.rows;
        });
    };

    const loadUserShips = async () => {
        isLoadingUserShips.value = true;

        await apiClient
            .get("user/ships")
            .then((response) => {
                return response.data.rows.map(populateUserShip);
            })
            .then((uss) => {
                userShips.value = uss;
            });

        isLoadingUserShips.value = false;
    };

    const loadWorkshops = async () => {
        isLoadingWorkshops.value = true;

        await apiClient.get("user/workshops").then((response) => {
            workshops.value = response.data.rows.map((r) => {
                return { ...r };
            });
        });

        isLoadingWorkshops.value = false;
    };

    const createOrUpdateUserShip = async (data) => {
        try {
            const res = await apiClient.post("user/ships", data);

            const us = userShips.value;

            const userShip = res.data.row;
            populateUserShip(userShip);

            if (data.id_user_ship) {
                const index = us.findIndex(
                    (s) => s.id_user_ship === data.id_user_ship
                );

                us.splice(index, 1, userShip);
            } else {
                us.push(userShip);
            }

            return true;
        } catch (err) {
            toast.error(
                "Error saving ship: " +
                    (err.response?.data?.message || err.message)
            );
            return false;
        }
    };

    const deleteUserShip = async (id_user_ship) => {
        try {
            await apiClient.delete("user/ships/" + id_user_ship);

            const us = [...userShips.value].map((s) => toRaw(s));

            const index = us.findIndex((s) => s.id_user_ship === id_user_ship);
            us.splice(index, 1);

            userShips.value = us;

            return true;
        } catch (err) {
            toast.error(
                "Error deleting ship: " +
                    (err.response?.data?.message || err.message)
            );
            return false;
        }
    };

    const createWorkshop = async (data) => {
        try {
            const res = await apiClient.post("user/workshops", data);

            workshops.value.push(res.data.row);

            return res.data.row;
        } catch (err) {
            toast.error(
                "Error creating workshop: " +
                    (err.response?.data?.message || err.message)
            );
            return false;
        }
    };

    const deleteWorkshop = async (id_workshop) => {
        try {
            await apiClient.delete(`user/workshops/${id_workshop}`);

            const ws = [...workshops.value].map((w) => toRaw(w));

            const index = ws.findIndex((w) => w.id_workshop === id_workshop);
            ws.splice(index, 1);

            workshops.value = ws;

            return true;
        } catch (err) {
            toast.error(
                "Error deleting workshop: " +
                    (err.response?.data?.message || err.message)
            );
            return false;
        }
    };

    const loadWorkshopFleets = async (id_workshop) => {
        const fleets = await apiClient
            .get(`user/workshops/${id_workshop}/fleets`)
            .then((response) => {
                return response.data.rows.map((fleet) => {
                    fleet.user_ships = fleet.user_ships.filter((us) => {
                        return us.visible;
                    });
                    return fleet;
                });
            });

        setSelectedFleets(fleets);
    };

    const setSelectedFleets = (fleets) => {
        selectedFleets.value = fleets.map((f) => {
            f.user_ships = f.user_ships.map((fus) => {
                const subShip = {
                    ...cloneDeep(
                        toRaw(
                            userShips.value.find(
                                (us) => us.id_user_ship === fus.id_user_ship
                            )
                        )
                    ),
                    pivot: fus.pivot,
                };

                return subShip;
            });

            f.stats = parseFleetBasicStats(f); // parse first
            f.parsedAbilities = parseFleetShipsAbilities(f);

            return f;
        });
    };

    const createOrUpdateFleet = async (id_workshop, location, data) => {
        return apiClient
            .post(`user/workshops/${id_workshop}/fleets`, { ...data, location })
            .then((response) => response.data.row)
            .then((fleet) => {
                const fleets = selectedFleets.value;

                if (data.id_workshop_fleet) {
                    const fleetIndex = fleets.findIndex(
                        (f) => f.id_workshop_fleet === data.id_workshop_fleet
                    );
                    fleets.splice(fleetIndex, 1, fleet);
                } else {
                    fleets.push(fleet);
                }

                setSelectedFleets(fleets);
            });
    };

    const deleteFleet = async (id_workshop, id_workshop_fleet) => {
        return apiClient
            .delete(`user/workshops/${id_workshop}/fleets/${id_workshop_fleet}`)
            .then(() => {
                const fleetIndex = selectedFleets.value.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleets = selectedFleets.value;

                fleets.splice(fleetIndex, 1);

                setSelectedFleets(fleets);
            });
    };

    const addUserShipToFleet = (
        id_workshop,
        id_workshop_fleet,
        id_user_ship
    ) => {
        return apiClient
            .post(
                `user/workshops/${id_workshop}/fleets/${id_workshop_fleet}/ships`,
                { id_user_ship }
            )
            .then((response) => response.data.row)
            .then((fleet) => {
                const fleetIndex = selectedFleets.value.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleets = selectedFleets.value;

                fleets.splice(fleetIndex, 1, fleet);

                setSelectedFleets(fleets);
            });
    };

    const removeUserShipFromFleet = (
        id_workshop,
        id_workshop_fleet,
        id_user_ship
    ) => {
        return apiClient
            .delete(
                `user/workshops/${id_workshop}/fleets/${id_workshop_fleet}/ships/${id_user_ship}`
            )
            .then((response) => response.data.row)
            .then((fleet) => {
                const fleetIndex = selectedFleets.value.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleets = selectedFleets.value;

                fleets.splice(fleetIndex, 1, fleet);

                setSelectedFleets(fleets);
            });
    };

    const setFleetFlagship = (id_workshop, id_workshop_fleet, id_user_ship) => {
        return apiClient
            .post(
                `user/workshops/${id_workshop}/fleets/${id_workshop_fleet}/flagship`,
                { id_user_ship }
            )
            .then((response) => response.data.row)
            .then(() => {
                const fleetIndex = selectedFleets.value.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleet = selectedFleets.value[fleetIndex];

                const uss = [...fleet.user_ships]
                    .map((us) => toRaw(us))
                    .map((us) => ({
                        ...us,
                        pivot: {
                            ...us.pivot,
                            flagship: us.id_user_ship === id_user_ship,
                        },
                    }));

                selectedFleets.value[fleetIndex].user_ships = uss; // set ships before getting stats

                selectedFleets.value[fleetIndex].stats =
                    parseFleetBasicStats(fleet); // parse first
                selectedFleets.value[fleetIndex].parsedAbilities =
                    parseFleetShipsAbilities(fleet);
            });
    };

    return {
        userShips,
        isLoadingUserShips,
        isLoadingShips,
        ships,
        shipClasses,
        workshops,
        isLoadingWorkshops,
        selectedFleets,
        selectedFleetsAbilityLists,
        selectedFleetsStats,
        loadShips,
        loadShipClasses,
        loadUserShips,
        loadWorkshops,
        createWorkshop,
        deleteUserShip,
        createOrUpdateUserShip,
        deleteWorkshop,
        loadWorkshopFleets,
        createOrUpdateFleet,
        deleteFleet,
        addUserShipToFleet,
        removeUserShipFromFleet,
        setFleetFlagship,
        setSelectedWorkshopId,
    };
});

export default useBuilderStore;
