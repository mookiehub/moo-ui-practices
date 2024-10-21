<template>
    <div
        :class="[
            'moo-input-number',
            {
                active,
                disabled,
                [`moo-input-number-${size}`]: size,
                'controls-on-right': controlsOnRight
            }
        ]"
    >
        <span
            v-if="!controlsOnRight"
            :class="
                [
                    'moo-input-number__control moo-input-number__control--decrease iconfont icon-jianhao_o',
                    {
                        disabled: decreaseDisabled
                    }
                ]
            "
            @mouseenter="handleControlMouseenter"
            @mouseleave="handleControlMouseleave"
            @click="handleDecrease"
        ></span>
        <moo-input
            class="moo-input-number__inner"
            ref="input"
            :value="inputValue"
            :disabled="disabled"
            :size="size"
            v-bind="$attrs"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @input="handleInput"
            @change="handleInputChange"
            @keydown.down.native.prevent="handleDecrease"
            @keydown.up.native.prevent="handleIncrease"
        ></moo-input>
        <span
            v-if="!controlsOnRight"
            :class="[
                'moo-input-number__control moo-input-number__control--increase iconfont icon-jiahao_o',
                {
                    disabled: increaseDisabled
                }
            ]"
            @mouseenter="handleControlMouseenter"
            @mouseleave="handleControlMouseleave"
            @click="handleIncrease"
        ></span>
        <span class="moo-input-number__controls" v-if="controlsOnRight">
            <span
                :class="[
                    'moo-input-number__control--right moo-input-number__control--up iconfont icon-jiantou',
                    {
                        disabled: increaseDisabled
                    }
                ]"
                @mouseenter="handleControlMouseenter"
                @mouseleave="handleControlMouseleave"
                @click="handleIncrease"
            ></span>
            <span
                :class="
                    [
                        'moo-input-number__control--right moo-input-number__control--down iconfont icon-jiantou',
                        {
                            disabled: decreaseDisabled
                        }
                    ]
                "
                @mouseenter="handleControlMouseenter"
                @mouseleave="handleControlMouseleave"
                @click="handleDecrease"
            ></span>
        </span>
    </div>
</template>

<script>
import { sizes } from '../../constants';
import MooInput from '../Input/index.vue';

const getPrecision = number => {
    if (isNaN(number)) {
        return 0;
    }
    const string = String(number);
    const pointIndex = string.lastIndexOf('.');
    if (pointIndex === -1) {
        return 0;
    }
    return string.length - 1 - pointIndex;
};

export default {
    name: 'MooInputNumber',
    components: {
        MooInput
    },
    model: {
        event: 'change'
    },
    props: {
        value: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: -Infinity
        },
        max: {
            type: Number,
            default: Infinity
        },
        step: {
            type: Number,
            default: 1
        },
        stepStrictly: Boolean,
        precision: Number,
        size: {
            type: String,
            validator: value => sizes.includes(value)
        },
        disabled: Boolean,
        controls: {
            type: Boolean,
            default: true
        },
        controlsPosition: {
            type: String,
            default: 'right'
        }
    },
    data() {
        return {
            active: false,
            inputValue: ''
        };
    },
    computed: {
        valueStep() {
            return Number(this.step) || 1;
        },
        valuePrecision() {
            const precision = Number(this.precision) || 0;
            const stepPrecision = getPrecision(this.valueStep);
            return precision < stepPrecision ? stepPrecision : precision;
        },
        decreaseDisabled() {
            return this.disabled || this.inputValue <= this.min;
        },
        increaseDisabled() {
            return this.disabled || this.inputValue >= this.max;
        },
        controlsOnRight() {
            return this.controlsPosition === 'right';
        }
    },
    watch: {
        value: {
            handler(value) {
                this.inputValue = this.converToString(value);
            },
            immediate: true
        }
    },
    methods: {
        handleInputFocus(event) {
            this.active = true;
            this.$emit('focus', event);
        },
        handleInputBlur(event) {
            this.active = false;
            this.$emit('blur', event);
        },
        handleInput(value) {
            this.inputValue = value;
        },
        handleInputChange(value) {
            if (isNaN(value) || value < this.min || value > this.max) {
                this.inputValue = this.converToString(this.value);
                return;
            }
            let newValue = Number(value);
            if (this.stepStrictly) {
                const remainder = newValue % this.valueStep;
                if (remainder) {
                    const multiple = parseInt(newValue / this.valueStep);
                    newValue = this.valueStep * multiple;
                }
            }
            const oldValue = isNaN(this.value) ? this.value : Number(this.value);
            this.$emit('change', newValue, oldValue);
        },
        handleControlMouseenter() {
            if (this.disabled) {
                return;
            }
            this.active = true;
        },
        handleControlMouseleave() {
            this.active = false;
        },
        handleDecrease() {
            if (this.decreaseDisabled) {
                return;
            }
            const value = Number(this.value) || 0;
            let newValue = value - this.valueStep;
            newValue = newValue < this.min ? this.min : newValue;
            const oldValue = isNaN(this.value) ? this.value : Number(this.value);
            this.$emit('change', newValue, oldValue);
        },
        handleIncrease() {
            if (this.increaseDisabled) {
                return;
            }
            const value = Number(this.value) || 0;
            let newValue = value + this.valueStep;
            newValue = newValue > this.max ? this.max : newValue;
            const oldValue = isNaN(this.value) ? this.value : Number(this.value);
            this.$emit('change', newValue, oldValue);
        },
        converToString(value) {
            if (typeof value === 'string') {
                return value;
            }
            if (typeof value === 'number') {
                return value.toFixed(this.valuePrecision).toString();
            }
            return '';
        },
        focus() {
            this.$refs.input.focus();
        },
        select() {
            this.$refs.input.select();
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-input-number {
    width: 180px;
    border: 1px solid $border-base-color;
    border-radius: $border-radius;
    display: inline-flex;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
        border-color: $placeholder-color;
    }

    &.active {
        border-color: $primary-color;
    }

    &.disabled:hover {
        border-color: $border-base-color;
    }

    &--small,
    &--mini {
        width: 130px;
    }

    .moo-input__inner {
        padding: 0;
        border: none;
    }

    .moo-input__control {
        text-align: center;
    }

    .moo-input-number__control {
        width: 40px;
        color: $regular-text-color;
        font-size: 14px;
        background-color: $hover-bgcolor;
        border-radius: $border-radius;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:hover {
            color: $primary-color;
        }

        &.disabled {
            color: $placeholder-color;
            cursor: not-allowed;

            &:hover {
                color: $placeholder-color;
            }
        }
    }
    .moo-input-number__control--decrease {
        border-right: 1px solid $border-base-color;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .moo-input-number__control--increase {
        border-left: 1px solid $border-base-color;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .moo-input-number__controls {
        width: 40px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
    }
    .moo-input-number__control--right {
        width: 100%;
        color: $regular-text-color;
        font-size: 12px;
        background-color: $hover-bgcolor;
        border-left: 1px solid $border-base-color;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:first-child {
            border-bottom: 1px solid $border-base-color;
            border-top-right-radius: $border-radius;
        }
        &:last-child {
            border-bottom-right-radius: $border-radius;
        }

        &:hover {
            color: $primary-color;
        }

        &.disabled {
            color: $placeholder-color;
            cursor: not-allowed;

            &:hover {
                color: $placeholder-color;
            }
        }
    }
    .moo-input-number__control--up::before {
        transform: rotate(-90deg);
    }
    .moo-input-number__control--down::before {
        transform: rotate(90deg);
    }

    &.controls-on-right {
        .moo-input-number__inner,
        .moo-input__control {
            border-top-left-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
        }
    }
}
</style>
