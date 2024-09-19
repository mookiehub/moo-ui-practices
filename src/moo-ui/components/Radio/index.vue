<template>
    <label
        :class="[
            'moo-radio',
            {
                focused,
                checked,
                disabled: radioDisabled,
                bordered: border,
                [`moo-radio--${radioSize}`]: border && radioSize
            }
        ]"
    >
        <span class="moo-radio__inner">
            <span class="moo-radio__control"></span>
            <input
                class="moo-radio__input"
                type="radio"
                :name="name"
                :checked="checked"
                :disabled="radioDisabled"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            >
        </span>
        <span class="moo-radio__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script>
import { sizes } from '../../constants';

export default {
    name: 'MooRadio',
    model: {
        event: 'change'
    },
    props: {
        value: [String, Number, Boolean],
        label: [String, Number, Boolean],
        disabled: Boolean,
        border: Boolean,
        size: {
            type: String,
            validator: value => sizes.includes(value)
        },
        name: String
    },
    data() {
        return {
            focused: false
        };
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
            return this.value === this.label;
        },
        radioSize() {
            if (this.group) {
                return this.group.size;
            }
            return this.size;
        },
        radioDisabled() {
            if (this.$options.propsData.hasOwnProperty('disabled')) {
                return this.disabled;
            }
            if (this.group) {
                return this.group.disabled;
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
            if (event.target.checked) {
                if (this.group) {
                    this.group.change(this.label);
                } else {
                    this.$emit('change', this.label);
                }
            }
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-radio {
    color: $regular-text-color;
    font-size: 14px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    margin-right: 30px;
    cursor: pointer;
    
    .moo-radio__inner {
        width: 14px;
        height: 14px;
        position: relative;
    }

    .moo-radio__control {
        width: 100%;
        height: 100%;
        background-color: $background-w;
        border: 1px solid $border-base-color;
        border-radius: 50%;
        display: inline-block;
        position: relative;

        &:hover {
            border-color: $primary-color;
        }

        &::after {
            content: '';
            width: 4px;
            height: 4px;
            background-color: $background-w;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.15s ease-in;
        }
    }

    .moo-radio__input {
        width: 100%;
        height: 100%;
        outline: none;
        opacity: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        cursor: pointer;
    }

    .moo-radio__label {
        padding-left: 10px;
    }

    &.focused {
        .moo-radio__control {
            box-shadow: 0 0 2px 2px $primary-color;
        }
    }

    &.checked {
        color: $primary-color;

        .moo-radio__control {
            background-color: $primary-color;
            border-color: $primary-color;
            box-shadow: none;

            &::after {
                transform: translate(-50%, -50%) scale(1);
            }
        }
    }

    &.disabled {
        color: $placeholder-color;
        cursor: not-allowed;

        .moo-radio__control {
            background-color: #f5f7fa;
            &:hover {
                border-color: $border-base-color;
            }
        }
    }
    &.disabled.checked {
        .moo-radio__control {
            border-color: $border-light-color;

            &::after {
                background-color: $placeholder-color;
            }
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
        
        &.moo-radio--medium {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        &.moo-radio--small {
            font-size: 12px;
            padding: 8px 15px;
            padding-left: 10px;
        }
        &.moo-radio--mini {
            font-size: 12px;
            padding: 6px 15px;
            padding-left: 10px;
        }
    }
}
</style>
