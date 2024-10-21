<template>
    <div
        :class="[
            'moo-input',
            {
                disabled,
                exceeded: countExceeded,
                [`moo-input--${size}`]: size,
                'moo-input-group--prepend': $slots.prepend,
                'moo-input-group--append': $slots.append
            }
        ]"
    >
        <div
            v-if="inputType === 'text' && $slots.prepend"
            class="moo-input__slot moo-input__prepend"
        >
            <slot name="prepend"></slot>
        </div>
        <div class="moo-input__inner">
            <span
                v-if="inputType === 'text' && $slots.prefix"
                class="moo-input__inner-slot moo-input__prefix"
            >
                <slot name="prefix"></slot>
            </span>
            <input
                class="moo-input__control"
                ref="input"
                :type="inputType"
                :value="value"
                :maxlength="maxlength"
                :readonly="readonly"
                :disabled="disabled"
                v-bind="$attrs"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInput"
                @change="handleChange"
                @compositionstart="handleCompositionstart"
                @compositionend="handleCompositionend"
            >
            <span v-if="!disabled" class="moo-input__icons">
                <i
                    v-if="clearable && !readonly && valuable"
                    class="moo-input__icon iconfont icon-icon-qingkong"
                    @click="handleClearClick"
                ></i>
                <i
                    v-if="showPassword && (focused || valuable)"
                    class="moo-input__icon iconfont icon-chakan"
                    @click="handleShowPasswordClick"
                ></i>
            </span>
            <span v-if="showWordLimit && maxlength" class="moo-input__count">
                <span>{{ valueLength }}</span>
                <span>/</span>
                <span>{{ maxlength }}</span>
            </span>
            <span
                v-if="inputType === 'text' && $slots.suffix"
                class="moo-input__inner-slot moo-input__suffix"
            >
                <slot name="suffix"></slot>
            </span>
        </div>
        <div
            v-if="inputType === 'text' && $slots.append"
            class="moo-input__slot moo-input__append"
        >
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
import { sizes } from '../../constants';

export default {
    name: 'MooInput',
    props: {
        type: {
            type: String,
            default: 'text'
        },
        value: [String, Number],
        maxlength: Number,
        showWordLimit: Boolean,
        clearable: Boolean,
        showPassword: Boolean,
        disabled: Boolean,
        size: {
            type: String,
            validator: value => sizes.includes(value)
        },
        readonly: Boolean,
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            focused: false,
            isComposing: false,
            inputType: ''
        };
    },
    computed: {
        valuable() {
            if (typeof this.value === 'number') {
                return true;
            }
            return Boolean(this.value);
        },
        valueLength() {
            if (typeof this.value === 'number') {
                return this.value.toString().length;
            }
            if (typeof this.value === 'string') {
                return this.value.length;
            }
            return 0;
        },
        countExceeded() {
            if (this.showWordLimit && this.maxlength) {
                return this.valueLength > this.maxlength;
            }
            return false;
        }
    },
    watch: {
        showPassword: {
            handler(value) {
                this.inputType = value ? 'password' : this.type;
            },
            immediate: true
        },
        type: {
            handler(value) {
                this.inputType = this.showPassword ? 'password' : value;
            },
            immediate: true
        }
    },
    methods: {
        handleFocus(event) {
            this.focused = true;
            this.$emit('focus', event);
        },
        handleBlur(event) {
            this.focused = false;
            this.$emit('blur', event);
        },
        handleInput(event) {
            if (!this.isComposing) {
                this.$emit('input', event.target.value);
            }
        },
        handleChange(event) {
            this.$emit('change', event.target.value);
        },
        handleCompositionstart() {
            this.isComposing = true;
        },
        handleCompositionend(event) {
            this.isComposing = false;
            this.$emit('input', event.target.value);
        },
        handleClearClick() {
            this.$emit('input', null);
            this.$emit('clear');
            this.focus();
        },
        handleShowPasswordClick() {
            this.inputType = this.inputType === 'text' ? 'password' : 'text';
            this.$nextTick(() => {
                this.focus();
                const length = this.value?.length || 0;
                this.$refs.input.setSelectionRange(length, length);
            });
        },
        focus() {
            this.$refs.input.focus();
        },
        select() {
            this.focus();
            this.$refs.input.select();
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-input {
    width: 100%;
    height: 40px;
    color: $regular-text-color;
    font-size: 14px;
    line-height: 40px;
    background-color: $background-w;
    display: inline-flex;

    .moo-input__inner {
        padding: 0 15px;
        border: 1px solid $border-base-color;
        border-radius: $border-radius;
        flex: 1;
        display: flex;
        justify-content: space-between;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:hover {
            border-color: $placeholder-color;
        }
        &:focus-within {
            border-color: $primary-color;
        }
    }

    .moo-input__control {
        width: 100%;
        color: inherit;
        font-family: inherit;
        line-height: inherit;
        padding: 0;
        border: none;
        outline: none;
        cursor: inherit;

        &::placeholder {
            color: $placeholder-color;
        }
    }

    .moo-input__icons {
        line-height: normal;
        display: flex;
        align-items: center;
    }
    .moo-input__icon {
        color: $placeholder-color;
        font-size: 12px;
        padding: 4px;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: $regular-text-color;
        }

        &:first-child {
            margin-left: 7px;
        }
        &:last-child {
            margin-right: -7px;
        }

        &.icon-chakan {
            font-size: 16px;
        }
    }

    .moo-input__count {
        color: $info-color;
        font-size: 12px;
        margin-left: 7px;
    }

    .moo-input__slot {
        color: $info-color;
        background-color: $disabled-bgcolor;
        padding: 0 20px;
        border: 1px solid $border-base-color;
        display: flex;

        >[class^="moo-"] {
            color: inherit;
            background-color: transparent;
            border-color: transparent;
            flex: 1;
            margin: 0 -20px;
        }
    }
    .moo-input__prepend {
        border-right: none;
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
    }
    .moo-input__append {
        border-left: none;
        border-top-right-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
    }

    .moo-input__inner-slot {
        display: flex;
        align-items: center;
    }
    .moo-input__prefix {
        margin-right: 5px;
    }
    .moo-input__suffix {
        margin-left: 5px;
    }

    &-group--prepend {
        .moo-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
    &-group--append {
        .moo-input__inner {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    &--medium {
        height: 36px;
        line-height: 36px;
    }
    &--small {
        font-size: 13px;
        height: 32px;
        line-height: 32px;
    }
    &--mini {
        font-size: 12px;
        height: 28px;
        line-height: 28px;
    }

    &.disabled {
        color: $placeholder-color;
        background-color: $disabled-bgcolor;
        cursor: not-allowed;

        .moo-input__inner:hover {
            border-color: $border-base-color;
        }
    }

    &.exceeded {
        .moo-input__inner {
            border-color: $danger-color;
        }
    }
}
</style>
