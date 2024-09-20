<template>
    <label
        :class="[
            'moo-checkbox',
            {
                bordered: border,
                focused,
                checked: checked,
                disabled: isDisabled,
                indeterminate,
                [`moo-checkbox--${checkboxSize}`]: border && checkboxSize
            }
        ]"
    >
        <span class="moo-checkbox__inner">
            <span class="moo-checkbox__control"></span>
            <input
                class="moo-checkbox__input"
                type="checkbox"
                :name="name"
                :checked="checked"
                :disabled="isDisabled"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            >
        </span>
        <span class="moo-checkbox__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script>
import { sizes } from '../../constants';

export default {
    name: 'MooCheckbox',
    model: {
        event: 'change'
    },
    props: {
        value: [String, Number, Boolean],
        label: [String, Number, Boolean],
        trueLabel: [String, Number],
        falseLabel: [String, Number],
        disabled: Boolean,
        border: Boolean,
        size: {
            type: String,
            validator: value => sizes.includes(value)
        },
        name: String,
        indeterminate: Boolean
    },
    data() {
        return {
            focused: false
        };
    },
    computed: {
        group() {
            if (this.$parent && this.$parent.$options.name === 'MooCheckboxGroup') {
                return this.$parent;
            }
            return undefined;
        },
        checkboxSize() {
            if (this.group) {
                return this.group.size;
            }
            return this.size;
        },
        checked() {
            if (this.group) {
                const value = this.group.value || [];
                return value.includes(this.label);
            }
            return this.value === (this.trueLabel === undefined ? true : this.trueLabel);
        },
        isDisabled() {
            if (this.disabled) {
                return true;
            }
            if (this.group) {
                if (this.group.disabled) {
                    return true;
                }
                const { min, max } = this.group;
                const value = this.group.value || [];
                if (value.length <= min && this.checked) {
                    return true;
                }
                if (value.length >= max && !this.checked) {
                    return true;
                }
            }
            return false;
        }
    },
    methods: {
        handleFocus() {
            this.focused = true;
        },
        handleBlur() {
            this.focused = false;
        },
        handleChange(event) {
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

.moo-checkbox {
    color: $regular-text-color;
    font-size: 14px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    margin-right: 30px;
    cursor: pointer;

    .moo-checkbox__inner {
        width: 14px;
        height: 14px;
        position: relative;
    }

    .moo-checkbox__control {
        width: 100%;
        height: 100%;
        background-color: $background-w;
        border: 1px solid $border-base-color;
        border-radius: 2px;
        display: inline-block;
        position: relative;
        transition: 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);

        &:hover {
            border-color: $primary-color;
        }

        &::after {
            content: '';
            width: 4px;
            height: 8px;
            border: 1px solid $background-w;
            border-top: none;
            border-left: none;
            position: absolute;
            top: 1px;
            left: 4px;
            transform: rotate(45deg) scale(0);
            transition: transform 0.15s 0.05s ease-in;
        }
    }

    .moo-checkbox__input {
        width: 100%;
        height: 100%;
        outline: none;
        opacity: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .moo-checkbox__label {
        padding-left: 10px;
    }

    &.focused {
        .moo-checkbox__control {
            border-color: $primary-color;
        }
    }

    &.indeterminate {
        .moo-checkbox__control {
            background-color: $primary-color;
            border-color: $primary-color;

            &::before {
                content: '';
                width: 6px;
                height: 1px;
                background-color: $background-w;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            &::after {
                display: none;
            }
        }
    }

    &.checked {
        color: $primary-color;

        .moo-checkbox__control {
            background-color: $primary-color;
            border-color: $primary-color;

            &::after {
                transform: rotate(45deg) scale(1);
            }
        }
    }

    &.disabled {
        color: $placeholder-color;
        cursor: not-allowed;

        .moo-checkbox__control {
            background-color: #edf2fc;
            border-color: $border-base-color;
        }
    }
    &.disabled.checked {
        .moo-checkbox__control::after {
            border-color: $placeholder-color;
        }
    }

    &.bordered {
        padding: 12px 20px;
        padding-left: 10px;
        border: 1px solid $border-base-color;
        border-radius: $border-radius;

        &.checked {
            border-color: $primary-color;
        }
        &.disabled {
            border-color: $border-lighter-color;
        }
        
        &.moo-checkbox--medium {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        &.moo-checkbox--small {
            font-size: 12px;
            padding: 8px 15px;
            padding-left: 10px;
        }
        &.moo-checkbox--mini {
            font-size: 12px;
            padding: 6px 15px;
            padding-left: 10px;
        }
    }
}
</style>
