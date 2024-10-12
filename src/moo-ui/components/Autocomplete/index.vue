<template>
    <div
        :class="[
            'moo-autocomplete',
            {
                disabled,
                'moo-autocomplete-group--prepend': $slots.prepend,
                'moo-autocomplete-group--append': $slots.append
            }
        ]"
    >
        <moo-input
            ref="input"
            type="text"
            :disabled="disabled"
            :value="value"
            v-bind="$attrs"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @keydown.native="handleKeydown"
        >
            <template v-if="$slots.prepend" #prepend>
                <slot name="prepend"></slot>
            </template>
            <template v-if="$slots.append" #append>
                <slot name="append"></slot>
            </template>
            <template v-if="$slots.prefix" #prefix>
                <slot name="prefix"></slot>
            </template>
            <template v-if="$slots.suffix" #suffix>
                <slot name="suffix"></slot>
            </template>
        </moo-input>

        <div
            ref="suggestion"
            :class="[
                'moo-autocomplete__suggestion',
                `placement--${suggestionPlacement}`,
                popperClass,
                {
                    visible: suggestionVisible
                }
            ]"
            :style="{
                ...suggestionOffset
            }"
        >
            <div
                v-if="suggestionLoading"
                class="moo-autocomplete__suggestion-loading"
            >
                <i
                    class="moo-autocomplete__suggestion-loading-icon iconfont icon-jiazai"
                ></i>
            </div>
            <ul
                v-else
                class="moo-autocomplete__suggestion-list"
                ref="suggestionList"
            >
                <li
                    :class="[
                        'moo-autocomplete__suggestion-item',
                        {
                            active: index === suggestionActiveIndex
                        }
                    ]"
                    v-for="(item, index) in suggestionList"
                    :key="item[valueKey]"
                    @click="handleSuggestionItemClick(item)"
                >
                    <slot :item="item">{{ item[valueKey] }}</slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { placements } from './constants';
import MooInput from '../Input/index.vue';

let inputTimer;

export default {
    name: 'MooAutocomplete',
    components: {
        MooInput
    },
    props: {
        disabled: Boolean,
        valueKey: {
            type: String,
            default: 'value'
        },
        value: {
            type: String,
            required: true
        },
        debounce: {
            type: Number,
            default: 300
        },
        placement: {
            type: String,
            default: 'bottom-start',
            validator: value => placements.includes(value)
        },
        fetchSuggestions: Function,
        popperClass: String,
        triggerOnFocus: {
            type: Boolean,
            default: true
        },
        label: String,
        hideLoading: Boolean,
        highlightFirstItem: Boolean
    },
    data() {
        return {
            focused: false,
            suggestionVisible: false,
            suggestionLoading: false,
            suggestionOffset: {
                width: '',
                top: '',
                left: ''
            },
            suggestionPlacement: '',
            suggestionList: [],
            suggestionActiveIndex: -1
        };
    },
    mounted() {
        this.handleSuggestionOutsideClick();
        this.handleContainerScroll();
    },
    methods: {
        handleFocus() {
            this.focused = true;
            if (this.triggerOnFocus) {
                this.showSuggestion();
            }
        },
        handleBlur() {
            this.focused = false;
        },
        handleInput(value) {
            this.$emit('input', value);
            this.$nextTick(() => {
                clearTimeout(inputTimer);
                inputTimer = setTimeout(() => {
                    this.showSuggestion();
                }, this.debounce);
            });
        },
        handleKeydown(event) {
            if (!this.suggestionVisible || this.suggestionLoading) {
                return;
            }
            const { key } = event;
            const { scrollTop, offsetHeight, children } = this.$refs.suggestionList;
            const scrollIntoView = index => {
                const item = children[index];
                const itemHeight = item.offsetHeight;
                const itemTop = item.offsetTop;
                const itemBottom = itemTop + itemHeight;
                if (itemTop < scrollTop) {
                    this.$refs.suggestionList.scrollTop -= scrollTop - itemTop;
                } else if (itemBottom > offsetHeight + scrollTop) {
                    this.$refs.suggestionList.scrollTop += itemBottom - (offsetHeight + scrollTop);
                }
            };
            if (key === 'ArrowDown') {
                // 突出显示下一个建议选项并滚动至可视区域
                if (this.suggestionActiveIndex >= this.suggestionList.length - 1) {
                    return;
                }
                this.suggestionActiveIndex++;
                scrollIntoView(this.suggestionActiveIndex);
            } else if (key === 'ArrowUp') {
                // 突出显示上一个建议选项并滚动至可视区域
                if (this.suggestionActiveIndex <= 0) {
                    return;
                }
                this.suggestionActiveIndex--;
                scrollIntoView(this.suggestionActiveIndex);
            } else if (key === 'Enter') {
                // 选择当前突出显示的建议选项
                const item = this.suggestionList[this.suggestionActiveIndex];
                this.handleSuggestionItemClick(item);
            }
        },
        handleSuggestionOutsideClick() {
            const handler = event => {
                if (this.$el.contains(event.target)) {
                    return;
                }
                this.suggestionVisible = false;
            };
            addEventListener('click', handler);
            this.$once('hook:beforeDestroy', () => {
                removeEventListener('click', handler);
            });
        },
        showSuggestion() {
            if (typeof this.fetchSuggestions !== 'function') {
                return;
            }
            this.suggestionVisible = true;
            this.suggestionLoading = true;
            this.$nextTick(() => {
                this.calculateSuggestionOffset();
            });
            this.fetchSuggestions(this.value, data => {
                this.suggestionLoading = false;
                this.suggestionList = data || [];
                if (this.suggestionList.length) {
                    this.suggestionVisible = true;
                    this.$nextTick(() => {
                        this.suggestionActiveIndex =
                            this.highlightFirstItem &&
                            this.suggestionList.length ?
                            0 :
                            -1;
                        this.calculateSuggestionOffset();
                    });
                } else {
                    this.suggestionVisible = false;
                }
            });
        },
        // 计算建议面板位置和坐标
        calculateSuggestionOffset() {
            const {
                width: inputWidth,
                height: inputHeight,
                top: inputTop,
                right: inputRight,
                bottom: inputBottom,
                left: inputLeft
            } = this.$el.getBoundingClientRect();
            const { offsetWidth, offsetHeight } = this.$refs.suggestion;
            const offset = {
                width: inputWidth + 'px',
                top: '',
                left: ''
            };
            let placement = '';
            const verticalOffset = 12, horizontalOffset = 10;

            // 确定 top/bottom
            if (['top', 'top-start', 'top-end'].includes(this.placement)) {
                const isAllowed = inputTop >= offsetHeight + verticalOffset;
                placement = isAllowed ? 'top' : 'bottom';
            } else {
                const isAllowed = innerHeight - inputBottom >= offsetHeight + verticalOffset;
                placement = isAllowed ? 'bottom' : 'top';
            }
            if (placement === 'top') {
                offset.top = - (offsetHeight + verticalOffset) + 'px';
            } else {
                offset.top = inputHeight + verticalOffset + 'px';
            }

            // 确定 start/end
            if (['top-end', 'bottom-end'].includes(this.placement)) {
                let left = inputWidth - offsetWidth;
                const diff = offsetWidth - inputRight + horizontalOffset;
                if (diff > 0) {
                    left += diff;
                }
                offset.left = left + 'px';
                placement += '-end';
            } else {
                let left = 0;
                const diff = offsetWidth - (innerWidth - inputLeft) + horizontalOffset;
                if (diff > 0) {
                    left -= diff;
                }
                offset.left = left + 'px';
                placement += '-start';
            }
            this.suggestionOffset = offset;
            this.suggestionPlacement = placement;
        },
        handleContainerScroll() {
            const findScroller = el => {
                const parent = el.parentNode;
                if (!(parent instanceof Element)) {
                    return window;
                }
                const { overflow } = getComputedStyle(parent);
                if (overflow.includes('scroll') || overflow.includes('auto')) {
                    return parent === document.documentElement ? window : parent;
                }
                return findScroller(parent);
            };
            const scroller = findScroller(this.$el);
            const handler = () => {
                if (!this.suggestionVisible) {
                    return;
                }
                this.calculateSuggestionOffset();
            };
            scroller.addEventListener('scroll', handler);
            this.$once('hook:beforeDestroy', () => {
                scroller.removeEventListener('scroll', handler);
            });
        },
        handleSuggestionItemClick(item) {
            this.suggestionVisible = false;
            this.$emit('input', item[this.valueKey]);
            this.$emit('select', item);
        },
        focus() {
            this.$refs.input.focus();
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-autocomplete {
    height: 40px;
    color: $regular-text-color;
    font-size: 14px;
    line-height: 40px;
    background-color: $background-w;
    display: inline-flex;
    position: relative;

    &-group--prepend {
        .moo-autocomplete__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
    &-group--append {
        .moo-autocomplete__inner {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    &.disabled {
        background-color: $disabled-bgcolor;
        cursor: not-allowed;

        .moo-autocomplete__inner:hover {
            border-color: $border-base-color;
        }
    }
}

.moo-autocomplete__suggestion {
    color: $regular-text-color;
    font-size: 14px;
    background-color: $background-w;
    padding: 10px 0;
    border: 1px solid $border-light-color;
    border-radius: $border-radius;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    opacity: 0;
    position: absolute;
    transform: scale(1, 0);
    transition: opacity 0.2s, transform 0.2s;

    &.visible {
        opacity: 1;
        transform: scale(1, 1);
    }

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        background-color: $background-w;
        border: 1px solid $border-light-color;
        position: absolute;
        transform: rotate(45deg);
    }
    
    // 建议面板在 start 位置
    &[class*=placement--top-start],
    &[class*=placement--bottom-start] {
        &::before {
            left: 40px;
        }
    }
    // 建议面板在 end 位置
    &[class*=placement--top-end],
    &[class*=placement--bottom-end] {
        &::before {
            right: 40px;
        }
    }
    // 建议面板在 top 位置
    &[class*=placement--top] {
        transform-origin: bottom;
        &::before {
            border-top: none;
            border-left: none;
            bottom: -5px;
        }
    }
    // 建议面板在 bottom 位置
    &[class*=placement--bottom] {
        transform-origin: top;
        &::before {
            border-right: none;
            border-bottom: none;
            top: -5px;
        }
    }
}

.moo-autocomplete__suggestion-list {
    max-height: 280px;
    overflow: auto;
    position: relative;
}
.moo-autocomplete__suggestion-item {
    line-height: 34px;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 20px;
    overflow: hidden;
    cursor: pointer;

    &:hover,
    &.active {
        background-color: $hover-bgcolor;
    }
}

.moo-autocomplete__suggestion-loading {
    height: 100px;
    color: $secondary-text-color;
    display: flex;
    justify-content: center;
    align-items: center;
}
.moo-autocomplete__suggestion-loading-icon {
    font-size: 20px;
    animation: $loading-animation;
}
</style>
