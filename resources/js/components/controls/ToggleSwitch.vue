<template>
    <label class="toggle-switch">
        <input
            v-bind="$attrs"
            class="input"
            type="checkbox"
            :checked="modelValue"
            @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span class="switch"></span>
        <span class="label">{{ label }}</span>
    </label>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true,
        },
        modelValue: {
            type: Boolean,
            required: true,
        },
    },
};
</script>

<style scoped>
.toggle-switch {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.label {
    margin-left: 12px;
    /* Show an ellipsis if the text takes more than one line */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Visually hide the checkbox input */
.input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

.switch {
    --switch-container-width: 50px;
    --switch-size: calc(var(--switch-container-width) / 2);

    --light-gray: #a6adb8;
    --gray: #8f9aa6;
    --dark-gray: #66707c;
    --teal: #2aa196;
    --dark-teal: #26706f;

    /* Vertically center the inner circle */
    display: flex;
    align-items: center;
    position: relative;
    height: var(--switch-size);
    flex-basis: var(--switch-container-width);
    /* Make the container element rounded */
    border-radius: var(--switch-size);
    background-color: var(--light-gray);
    /* In case the label gets really long, the toggle shouldn't shrink. */
    flex-shrink: 0;

    transition: background-color 0.25s ease-in-out;
}

.switch::before {
    content: "";
    position: absolute;
    /* Move a little bit the inner circle to the right */
    left: 1px;
    height: calc(var(--switch-size) - 4px);
    width: calc(var(--switch-size) - 4px);
    /* Make the inner circle fully rounded */
    border-radius: 9999px;
    background-color: #505050;
    border: 2px solid var(--light-gray);

    transition: transform 0.375s ease-in-out;
}

.input:checked + .switch {
    background-color: var(--teal);
}

.input:checked + .switch::before {
    border-color: var(--teal);
    /* Move the inner circle to the right */
    transform: translateX(
        calc(var(--switch-container-width) - var(--switch-size))
    );
}

.input:focus + .switch::before {
    border-color: var(--gray);
}

.input:focus:checked + .switch::before {
    border-color: var(--dark-teal);
}

.input:disabled + .switch {
    background-color: var(--gray);
}

.input:disabled + .switch::before {
    background-color: var(--dark-gray);
    border-color: var(--dark-gray);
}
</style>
