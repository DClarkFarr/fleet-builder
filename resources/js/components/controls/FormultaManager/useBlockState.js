import { readonly, reactive } from "vue";

const state = reactive({
    activePath: "",
});

const setActivePath = (s) => {
    state.activePath = s;
};

const readableState = readonly(state);

export { setActivePath, readableState as blockState };
