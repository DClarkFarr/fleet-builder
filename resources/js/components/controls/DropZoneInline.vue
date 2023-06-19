<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

const apiClient = axios.create({
    withCredentials: true,
});

const emit = defineEmits(["uploaded", "removed"]);

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
        default: "",
    },
    data: {
        type: Object,
        required: false,
        default: () => ({}),
    },
});

const isDragged = ref(false);
const uploadInput = ref(null);
const rootElement = ref(null);
const isUploading = ref(false);

const uploadFile = async (file) => {
    isUploading.value = true;
    const formData = new FormData();
    formData.append("file", file);

    Object.entries(props.data).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        const { data } = await apiClient.post(props.url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        emit("uploaded", data);
    } catch (err) {
        console.warn("failed to upload file", err);
    }

    isUploading.value = false;
};

const onChangeFile = (e) => {
    const file = e.target.files[0];
    uploadFile(file);
};

const onDropFile = (e) => {
    isDragged.value = false;
    uploadFile(e.dataTransfer.files[0]);
};

const onParentClick = () => {
    if (!uploadInput.value) {
        console.warn("No input found");
        return;
    }
    uploadInput.value.click();
};

const onDragEnter = (e) => {
    isDragged.value = true;
};

const onDragLeave = (e) => {
    isDragged.value = false;
};

function preventDefaults(e) {
    e.preventDefault();
}

const onClickRemove = async () => {
    try {
        await apiClient.delete(props.url, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        emit("removed");
    } catch (err) {
        console.warn("failed to upload file", err);
    }
};

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
    events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults);
    });
});

onUnmounted(() => {
    events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults);
    });
});
</script>

<template>
    <div
        class="dropzone"
        ref="rootElement"
        :class="{ 'dropzone--empty': !img, 'dropzone--dragged': isDragged }"
        @click="onParentClick"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @drop.prevent="onDropFile"
    >
        <div>
            <div class="dropzone__uploading" v-if="isUploading">
                <slot name="uploading">
                    <span> Uploading... </span>
                </slot>
            </div>
            <div class="dropzone__dragged" v-else-if="isDragged">
                <slot name="dragged">
                    <span> Drop File To Upload </span>
                </slot>
            </div>
            <div class="dropzone__thumbnail relative" v-else-if="img">
                <div class="dropzone__remove">
                    <button
                        class="btn btn-red"
                        type="button"
                        @click.prevent.stop="onClickRemove"
                    >
                        &times;
                    </button>
                </div>
                <slot name="thumbnail" v-bind="{ img }">
                    <img :src="img" alt="Uploaded image" />
                </slot>
            </div>
            <div class="dropzone__message" v-else>
                <slot name="message">
                    <span> Upload a screenshot of ship stats view </span>
                </slot>
            </div>
        </div>

        <input
            type="file"
            class="hidden"
            ref="uploadInput"
            @change="onChangeFile"
        />
    </div>
</template>

<style lang="less" scoped>
.dropzone {
    &__uploading {
        user-select: none;
        @apply bg-gray-700 p-6 text-white text-center cursor-pointer border-2 border-gray-500;
    }
    &__message {
        user-select: none;
        @apply bg-gray-800 p-6 text-white text-center cursor-pointer border-2 border-gray-600;
    }

    &__dragged {
        user-select: none;
        pointer-events: none;
        @apply bg-gray-800 p-6 text-white text-center cursor-pointer border-2 border-dashed border-gray-600;
    }

    &__remove {
        position: absolute;
        top: 5px;
        right: 5px;
    }
}
</style>
