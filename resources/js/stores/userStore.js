import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/apiClient";

const useUserStore = defineStore("user", () => {
    const user = ref(null);

    const setUser = (user) => {
        user.value = user;
    };

    const refreshUser = () => {
        apiClient.get("user").then((response) => {
            setUser(response.data.user);
        });
    };

    return {
        user,
        setUser,
        refreshUser,
    };
});

export default useUserStore;
