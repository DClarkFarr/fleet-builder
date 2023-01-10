import { watchEffect } from "vue";
import useUserStore from "../stores/userStore";

const useMustAuthState = () => {
    const userStore = useUserStore();

    watchEffect(() => {
        if (!userStore.isLoading && !userStore.user) {
            window.location.href = "/";
        }
    });
};

export default useMustAuthState;
