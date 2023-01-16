import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";
import apiClient from "../services/ApiClient";
import { useToast } from "vue-toastification";
import { parseFleetShipsAbilities, parseFleetStats } from "../methods/fleet";
import { populateUserShipAbilityData } from "../methods/ship";

const useBuilderStore = defineStore("builder", () => {
    const toast = useToast();
    const ships = ref([]);
    const isLoadingShips = ref(false);

    const shipClasses = ref([]);

    const loadShips = async () => {
        isLoadingShips.value = true;

        await apiClient.get("data/ships").then((response) => {
            ships.value = response.data.rows;
        });

        isLoadingShips.value = false;
    };

    const loadShipClasses = async () => {
        return apiClient.get("data/ships/classes").then((response) => {
            shipClasses.value = response.data.rows;
        });
    };

    const userShips = ref([]);
    const isLoadingUserShips = ref(false);

    const workshops = ref([]);
    const isLoadingWorkshops = ref(false);

    const loadUserShips = async () => {
        isLoadingUserShips.value = true;

        await apiClient.get("user/ships").then((response) => {
            userShips.value = response.data.rows;
        });

        isLoadingUserShips.value = false;
    };

    const populateUserShipsAbilityData = () => {
        const us = [...userShips.value].map((us) => toRaw(us));

        us.forEach((s) => {
            populateUserShipAbilityData(s, {
                shipClasses: toRaw(shipClasses.value),
            });
        });

        userShips.value = us;
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

            const us = [...userShips.value].map((s) => toRaw(s));

            if (data.id_user_ship) {
                const index = us.findIndex(
                    (s) => s.id_user_ship === data.id_user_ship
                );
                us[index] = res.data.row;
            } else {
                us.push(res.data.row);
            }

            userShips.value = us;

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

        setWorkshopFleets(id_workshop, fleets);
    };

    const setWorkshopFleets = (id_workshop, fleets) => {
        const ws = workshops.value;
        const wsIndex = ws.findIndex(
            (w) => w.id_workshop === parseInt(id_workshop)
        );

        ws[wsIndex].fleets = fleets.map((f) => {
            const stats = parseFleetStats(f);
            f.stats = stats;

            f.user_ships.forEach((s) => {
                populateUserShipAbilityData(s, {
                    shipClasses: toRaw(shipClasses.value),
                });
            });

            f.parsedAbilities = parseFleetShipsAbilities(f);

            return f;
        });
    };

    const createOrUpdateFleet = async (id_workshop, location, data) => {
        return apiClient
            .post(`user/workshops/${id_workshop}/fleets`, { ...data, location })
            .then((response) => response.data.row)
            .then((fleet) => {
                const ws = workshops.value;

                const wsIndex = ws.findIndex(
                    (w) => w.id_workshop === parseInt(id_workshop)
                );

                const fleets = [...ws[wsIndex].fleets].map((f) => toRaw(f));

                if (data.id_workshop_fleet) {
                    const fleetIndex = ws[wsIndex].fleets.findIndex(
                        (f) => f.id_workshop_fleet === data.id_workshop_fleet
                    );
                    fleets[fleetIndex] = fleet;
                } else {
                    fleets.push(fleet);
                }

                setWorkshopFleets(id_workshop, fleets);
            });
    };

    const deleteFleet = async (id_workshop, id_workshop_fleet) => {
        return apiClient
            .delete(`user/workshops/${id_workshop}/fleets/${id_workshop_fleet}`)
            .then(() => {
                const ws = workshops.value;

                const wsIndex = ws.findIndex(
                    (w) => w.id_workshop === parseInt(id_workshop)
                );

                const fleetIndex = ws[wsIndex].fleets.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleets = [...ws[wsIndex].fleets].map((f) => toRaw(f));

                fleets.splice(fleetIndex, 1);

                setWorkshopFleets(id_workshop, fleets);
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
                const ws = workshops.value;

                const wsIndex = ws.findIndex(
                    (w) => w.id_workshop === parseInt(id_workshop)
                );

                const fleetIndex = ws[wsIndex].fleets.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleets = [...ws[wsIndex].fleets].map((f) => toRaw(f));

                fleets[fleetIndex] = fleet;

                setWorkshopFleets(id_workshop, fleets);
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
                const ws = workshops.value;

                const wsIndex = ws.findIndex(
                    (w) => w.id_workshop === parseInt(id_workshop)
                );

                const fleetIndex = ws[wsIndex].fleets.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleets = [...ws[wsIndex].fleets].map((f) => toRaw(f));

                fleets.splice(fleetIndex, 1, fleet);

                setWorkshopFleets(id_workshop, fleets);
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
                const ws = workshops.value;

                const wsIndex = ws.findIndex(
                    (w) => w.id_workshop === parseInt(id_workshop)
                );

                const fleetIndex = ws[wsIndex].fleets.findIndex(
                    (f) => f.id_workshop_fleet === parseInt(id_workshop_fleet)
                );

                const fleet = ws[wsIndex].fleets[fleetIndex];

                const uss = [...fleet.user_ships]
                    .map((us) => toRaw(us))
                    .map((us) => ({
                        ...us,
                        pivot: {
                            ...us.pivot,
                            flagship: us.id_user_ship === id_user_ship,
                        },
                    }));

                ws[wsIndex].fleets[fleetIndex].user_ships = uss;
                ws[wsIndex].fleets[fleetIndex].parsedAbilities =
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
        populateUserShipsAbilityData,
        setFleetFlagship,
    };
});

export default useBuilderStore;
