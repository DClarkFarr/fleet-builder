import { defineStore } from "pinia";
import { computed, ref } from "vue";
import apiClient from "../services/apiClient";

const useUserStore = defineStore("user", () => {
    const user = ref(null);

    const setUser = (u) => {
        user.value = u;
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

    return {
        user,
        isAdmin,
        setUser,
        refresh,
        logout,
    };
});

export default useUserStore;
