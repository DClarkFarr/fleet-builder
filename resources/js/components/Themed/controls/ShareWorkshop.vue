<script setup>
import { computed, ref } from "vue";
import { useClipboard } from "@vueuse/core";
import { useToast } from "vue-toastification";
import { debounce } from "lodash";

import ShareAltIcon from "~icons/fa-solid/share-alt";

const props = defineProps({
    id_workshop: {
        type: [String, Number],
        required: true,
    },
});

const inputRef = ref(null);

const toast = useToast();

const url = computed(() => {
    return window.location.origin + "/share/" + props.id_workshop;
});

const { copy, isSupported } = useClipboard();

const onCopy = async () => {
    await copy(url.value);

    toastDebounced();
};

const toastDebounced = debounce(() => {
    if (isSupported.value) {
        toast.success("Copied to clipboard");
    }
}, 750);

const onFocusInput = (e) => {
    onCopy();
    e.target.select();
    e.target.setSelectionRange(0, 9999);
};

const onClick = () => {
    onFocusInput({ target: inputRef.value });
};
</script>

<template>
    <div class="share-bar">
        <div
            class="flex rounded dark-border-end border-1 overflow-hidden items-stretch"
        >
            <div
                class="bg-box-gray text-box-gray-text flex justify-center items-center px-3 cursor-pointer"
                @click="onClick"
            >
                <ShareAltIcon />
            </div>
            <div>
                <input
                    ref="inputRef"
                    type="text"
                    class="input-clean"
                    readonly
                    :value="url"
                    @focus="onFocusInput"
                />
            </div>
        </div>
    </div>
</template>
