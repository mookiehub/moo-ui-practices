<template>
    <div
        ref="container"
        :class="[
            'moo-textarea',
            {
                disabled,
                exceeded: countExceeded
            }
        ]"
    >
        <textarea
            class="moo-textarea__control"
            ref="textarea"
            :style="{
                minHeight: textareaHeight.minHeight,
                maxHeight: textareaHeight.maxHeight,
                resize
            }"
            :disabled="disabled"
            :maxlength="maxlength"
            :value="value"
            v-bind="$attrs"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
            @compositionstart="handleCompositionstart"
            @compositionend="handleCompositionend"
        ></textarea>
        <span v-if="showWordLimit && maxlength" class="moo-textarea__count">
            <span>{{ valueLength }}</span>
            <span>/</span>
            <span>{{ maxlength }}</span>
        </span>
    </div>
</template>

<script>
import { calculateTextareaHeight, removeTextareaCopy } from './utils';

let resizeObserver;

export default {
    name: 'MooTextarea',
    props: {
        value: [String, Number],
        maxlength: Number,
        showWordLimit: Boolean,
        disabled: Boolean,
        autosize: {
            type: [Boolean, Object],
            default: false
        },
        autocomplete: {
            type: String,
            default: 'off',
            validator: value => ['on', 'off'].includes(value)
        },
        resize: {
            type: String,
            default: 'vertical',
            validator: value => ['none', 'both', 'horizontal', 'vertical'].includes(value)
        },
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            textareaHeight: {
                height: '',
                minHeight: '',
                maxHeight: ''
            },
            isComposing: false
        };
    },
    computed: {
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
        'textareaHeight.height'(value) {
            this.$nextTick(() => {
                this.$refs.textarea.style.height = value;
            });
        },
        value() {
            if (this.autosize) {
                this.$nextTick(() => {
                    this.textareaHeight = calculateTextareaHeight(this.$refs.textarea, this.autosize);
                });
            }
        },
        resize: {
            handler(value) {
                if (value === 'both' || value === 'horizontal') {
                    this.$nextTick(() => {
                        this.observeTextareaSize();
                    });
                } else {
                    resizeObserver && resizeObserver.unobserve();
                }
            },
            immediate: true
        }
    },
    mounted() {
        if (this.autosize) {
            this.textareaHeight = calculateTextareaHeight(this.$refs.textarea, this.autosize);
            removeTextareaCopy();
        }
        removeTextareaCopy();
    },
    methods: {
        handleFocus(event) {
            this.$emit('focus', event);
        },
        handleBlur(event) {
            this.$emit('blur', event);
            if (this.autosize) {
                removeTextareaCopy();
            }
        },
        handleInput(event) {
            if (this.isComposing) {
                return;
            }
            this.$emit('input', event.target.value);
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
        observeTextareaSize() {
            resizeObserver = resizeObserver || new ResizeObserver(entries => {
                for (const entry of entries) {
                    const size = entry.borderBoxSize[0];
                    if (this.$refs.container.style.width === size.inlineSize + 'px') {
                        return;
                    }
                    this.$refs.container.style.width = size.inlineSize + 'px';
                }
            });
            resizeObserver.observe(this.$refs.textarea);
        },
        focus() {
            this.$refs.textarea.focus();
        },
        select() {
            this.focus();
            this.$refs.textarea.select();
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-textarea {
    width: 100%;
    color: $regular-text-color;
    font-size: 14px;
    background-color: $background-w;
    vertical-align: bottom;
    display: inline-block;
    position: relative;

    .moo-textarea__control {
        width: 100%;
        line-height: 1.5;
        padding: 5px 15px;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        border: 1px solid $border-base-color;
        border-radius: $border-radius;
        outline: none;
        cursor: inherit;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:hover {
            border-color: $placeholder-color;
        }
        &:focus {
            border-color: $primary-color;
        }

        &::placeholder {
            color: $placeholder-color;
        }
    }

    .moo-textarea__count {
        color: $info-color;
        font-size: 12px;
        background-color: $background-w;
        position: absolute;
        right: 10px;
        bottom: 5px;
    }

    &.disabled {
        background-color: $disabled-bgcolor;
        cursor: not-allowed;

        .moo-textarea__control:hover {
            border-color: $border-base-color;
        }
    }

    &.exceeded {
        .moo-textarea__control {
            border-color: $danger-color;
        }
    }
}
</style>
