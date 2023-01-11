import { defineStore } from "pinia";
import { computed, ref } from "vue";
import apiClient from "../services/apiClient";
import { useToast } from "vue-toastification";
import { toRaw } from "vue";

const useUserStore = defineStore("user", () => {
    const toast = useToast();

    const user = ref(null);

    const isLoading = ref(true);

    const ships = ref([]);
    const isLoadingShips = ref(false);

    const workshops = ref([]);
    const isLoadingWorkshops = ref(false);

    const setUser = (u) => {
        user.value = u;
        isLoading.value = false;
    };

    const refresh = async () => {
        try {
            await apiClient.get("user").then((response) => {
                setUser(response.data.user);
            });

            return true;
        } catch (err) {
            return false;
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            await apiClient.post("user/logout");

            return true;
        } catch (err) {
            return false;
        }
    };

    const isAdmin = computed(() => {
        return (user.value && user.value.roles?.includes("admin")) || false;
    });

    const loadShips = async () => {
        isLoadingShips.value = true;

        await apiClient.get("user/ships").then((response) => {
            ships.value = response.data.rows;
        });

        isLoadingShips.value = false;
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

    return {
        user,
        ships,
        isAdmin,
        isLoading,
        isLoadingShips,
        workshops,
        isLoadingWorkshops,
        setUser,
        refresh,
        logout,
        loadShips,
        createWorkshop,
        deleteUserShip,
        createOrUpdateUserShip,
    };
});

export default useUserStore;
