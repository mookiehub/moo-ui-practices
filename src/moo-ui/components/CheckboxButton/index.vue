<template>
    <label
        :class="[
            'moo-checkbox-button',
            {
                checked,
                disabled,
                [`moo-checkbox-button--${size}`]: size
            }
        ]"
        :style="{
            color: activeColor,
            backgroundColor: activeBgColor,
            borderColor: activeBgColor
        }"
    >
        <input
            class="moo-checkbox-button__input"
            type="checkbox"
            :name="name"
            :checked="checked"
            :disabled="disabled"
            @change="handleChange"
        >
        <span class="moo-checkbox-button__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script>
export default {
    name: 'MooCheckboxButton',
    props: {
        label: [String, Number],
        trueLabel: [String, Number],
        falseLabel: [String, Number],
        disabled: Boolean,
        name: String
    },
    computed: {
        group() {
            if (this.$parent && this.$parent.$options.name === 'MooCheckboxGroup') {
                return this.$parent;
            }
            return undefined;
        },
        checked() {
            if (this.group) {
                const value = this.group.value || [];
                return value.includes(this.label);
            }
            return this.value === (this.trueLabel === undefined ? true : this.trueLabel);
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
        handleChange(event) {
            if (this.disabled) {
                return;
            }
            if (this.group) {
                const value = [...(this.group.value || [])];
                const index = value.indexOf(this.label);
                if (index === -1) {
                    value.push(this.label);
                } else {
                    value.splice(index, 1);
                }
                this.group.change(value);
            } else {
                const { checked } = event.target;
                let value;
                if (checked) {
                    value = this.trueLabel === undefined ? true : this.trueLabel;
                } else {
                    value = this.falseLabel === undefined ? false : this.falseLabel;
                }
                this.$emit('change', value);
            }
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-checkbox-button {
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

        &:nth-child(n+2) {
            border-left-color: $border-base-color;
        }
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

    .moo-checkbox-button__input {
        outline: none;
        opacity: 0;
        position: absolute;
        z-index: -1;
    }
}
</style>
