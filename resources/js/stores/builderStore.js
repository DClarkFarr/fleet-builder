import { defineStore } from "pinia";
import { computed, ref } from "vue";
import apiClient from "../services/ApiClient";
import { useToast } from "vue-toastification";
import { toRaw } from "vue";

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

    const loadWorkshops = async () => {
        isLoadingWorkshops.value = true;

        await apiClient.get("user/workshops").then((response) => {
            workshops.value = response.data.rows;
        });

        isLoadingWorkshops.value = false;
    };

    const createOrUpdateUserShip = async (data) => {
        try {
            const res = await apiClient.post("user/ships", data);

            const ss = [...ships.value].map((s) => toRaw(s));

            if (data.id_user_ship) {
                const index = ss.findIndex(
                    (s) => s.id_user_ship === data.id_user_ship
                );
                ss[index] = res.data.row;
            } else {
                ss.push(res.data.row);
            }

            ships.value = ss;

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

            const ss = [...ships.value].map((s) => toRaw(s));

            const index = ss.findIndex((s) => s.id_user_ship === id_user_ship);
            ss.splice(index, 1);

            ships.value = ss;

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
    };
});

export default useBuilderStore;
