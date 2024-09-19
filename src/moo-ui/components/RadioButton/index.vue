<template>
    <label
        :class="[
            'moo-radio-button',
            {
                checked,
                disabled,
                [`moo-radio-button--${size}`]: size
            }
        ]"
        :style="{
            color: activeColor,
            backgroundColor: activeBgColor,
            borderColor: activeBgColor
        }"
        @click="handleClick"
    >
        <input
            class="moo-radio-button__input"
            type="radio"
            :name="name"
            :checked="checked"
            :disabled="disabled"
        >
        <span class="moo-radio-button__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script>
export default {
    name: 'MooRadioButton',
    props: {
        label: [String, Number],
        disabled: Boolean,
        name: String
    },
    computed: {
        group() {
            if (this.$parent && this.$parent.$options.name === 'MooRadioGroup') {
                return this.$parent;
            }
            return undefined;
        },
        checked() {
            if (this.group) {
                return this.group.value === this.label;
            }
            return false;
        },
        size() {
            return this.group?.size;
        },
        activeColor() {
            if (this.checked && this.group) {
                return this.group.textColor;
            }
            return '';
        },
        activeBgColor() {
            if (this.checked && this.group) {
                return this.group.fill;
            }
            return '';
        }
    },
    methods: {
        handleClick() {
            if (this.disabled || this.checked) {
                return;
            }
            if (this.group) {
                this.group.change(this.label);
            }
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-radio-button {
    color: $regular-text-color;
    font-size: 14px;
    background-color: $background-w;
    padding: 12px 20px;
    border: 1px solid $border-base-color;
    display: inline-block;
    position: relative;
    cursor: pointer;
    transition: 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    
    &:first-of-type {
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
    }
    &:last-of-type {
        border-top-right-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
    }
    &:nth-child(n+2) {
        border-left-color: transparent;
    }

    &:hover {
        color: $primary-color;
    }

    &.checked {
        color: $background-w;
        background-color: $primary-color;
        border-color: $primary-color;
    }

    &.disabled {
        color: $placeholder-color;
        border-color: $border-lighter-color;
        cursor: not-allowed;

        &.checked {
            background-color: $border-extralight-color;
        }
    }

    &--medium {
        padding-top: 10px;
        padding-bottom: 10px;
    }
    &--small {
        font-size: 12px;
        padding: 9px 15px;
    }
    &--mini {
        font-size: 12px;
        padding: 7px 15px;
    }

    .moo-radio-button__input {
        outline: none;
        opacity: 0;
        position: absolute;
        z-index: -1;
    }
}
</style>
