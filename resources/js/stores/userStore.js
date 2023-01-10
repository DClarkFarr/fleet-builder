import { defineStore } from "pinia";
import { computed, ref } from "vue";
import apiClient from "../services/apiClient";

const useUserStore = defineStore("user", () => {
    const user = ref(null);

    const isLoading = ref(true);

    const ships = ref([]);
    const isLoadingShips = ref(false);

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

    return {
        user,
        isAdmin,
        isLoading,
        setUser,
        refresh,
        logout,
        loadShips,
    };
});

export default useUserStore;
