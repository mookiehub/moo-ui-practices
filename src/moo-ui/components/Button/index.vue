<template>
    <button
        :class="[
            'moo-button',
            {
                [`moo-button--${type}`]: type,
                [`moo-button--${size}`]: size,
                plain,
                round,
                disabled,
                loading
            }
        ]"
        :type="nativeType"
        :autofocus="autofocus"
        :disabled="disabled || loading"
        @click="handleClick"
    >
        <i
            v-if="loading"
            class="moo-button__loading-icon iconfont icon-jiazai"
        ></i>
        <slot></slot>
    </button>
</template>

<script>
import { sizes, themeTypes } from '../../constants';

export default {
    name: 'MooButton',
    props: {
        size: {
            type: String,
            validator: value => sizes.includes(value)
        },
        type: {
            type: String,
            validator: value => themeTypes.includes(value)
        },
        nativeType: {
            type: String,
            default: 'button',
            validator: value => ['button', 'submit', 'reset'].includes(value)
        },
        plain: Boolean,
        round: Boolean,
        loading: Boolean,
        disabled: Boolean,
        autofocus: Boolean,
    },
    methods: {
        handleClick(event) {
            this.$emit('click', event);
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-button {
    color: $regular-text-color;
    font-size: 14px;
    line-height: 1;
    background-color: #fff;
    padding: 12px 20px;
    border: 1px solid $border-base-color;
    border-radius: $border-radius;
    outline: none;
    cursor: pointer;
    transition-duration: 0.1s;

    &:hover,
    &:focus {
        color: $primary-color;
        background-color: $primary-lighter-color;
        border-color: #c6e2ff;
    }
    &:active {
        color: #3a8ee6;
        border-color: #3a8ee6;
    }

    &.round {
        border-radius: 20px;
    }

    &+.moo-button {
        margin-left: 10px;
    }

    // 中等尺寸
    &--medium {
        padding: 10px 20px;
    }
    // 小尺寸
    &--small {
        font-size: 12px;
        padding: 9px 15px;
    }
    // 超小尺寸
    &--mini {
        font-size: 12px;
        padding: 7px 15px;
    }

    // 朴素按钮
    &.plain {
        &:hover,
        &:focus {
            color: $primary-color;
            background-color: #fff;
            border-color: $primary-color;
        }
    }

    // 禁用状态
    &.disabled {
        color: $placeholder-color;
        border-color: #ebeef5;
        cursor: not-allowed;
        &:hover,
        &:focus {
            color: $placeholder-color;
            background-color: #fff;
            border-color: #ebeef5;
        }
        &:active {
            color: $placeholder-color;
            border-color: #ebeef5;
        }
    }

    // 加载中
    &.loading {
        user-select: none;
        pointer-events: none;
        position: relative;

        &::before {
            content: '';
            background-color: rgba(255, 255, 255, 0.5);
            position: absolute;
            top: -1px;
            right: -1px;
            bottom: -1px;
            left: -1px;
        }
    }

    // 主要按钮
    &--primary {
        color: #fff;
        background-color: $primary-color;
        border-color: $primary-color;
        &:hover,
        &:focus {
            color: #fff;
            background-color: #66b1ff;
            border-color: #66b1ff;
        }
        &:active {
            color: #fff;
            background-color: #3a8ee6;
            border-color: #3a8ee6;
        }

        &.plain {
            color: $primary-color;
            background-color: $primary-lighter-color;
            border-color: #b3d8ff;
            &:hover,
            &:focus {
                color: #fff;
                background-color: $primary-color;
                border-color: $primary-color;
            }
            &:active {
                background-color: #3a8ee6;
                border-color: #3a8ee6;
            }

            &.disabled {
                @mixin colors {
                    color: #8cc5ff;
                    background-color: #ecf5ff;
                    border-color: #d9ecff;
                }

                @include colors;
                &:hover,
                &:focus,
                &:active {
                    @include colors;
                }
            }
        }

        &.disabled {
            @mixin colors {
                color: #fff;
                background-color: #a0cfff;
                border-color: #a0cfff;
            }

            @include colors;
            &:hover,
            &:focus,
            &:active {
                @include colors;
            }
        }
    }

    // 成功按钮
    &--success {
        color: #fff;
        background-color: $success-color;
        border-color: $success-color;
        &:hover,
        &:focus {
            color: #fff;
            background-color: #85ce61;
            border-color: #85ce61;
        }
        &:active {
            color: #fff;
            background-color: #5daf34;
            border-color: #5daf34;
        }

        &.plain {
            color: $success-color;
            background-color: $success-lighter-color;
            border-color: #c2e7b0;
            &:hover,
            &:focus {
                color: #fff;
                background-color: $success-color;
                border-color: $success-color;
            }
            &:active {
                background-color: #5daf34;
                border-color: #5daf34;
            }

            &.disabled {
                @mixin colors {
                    color: #a4da89;
                    background-color: #f0f9eb;
                    border-color: #e1f3d8;
                }

                @include colors;
                &:hover,
                &:focus,
                &:active {
                    @include colors;
                }
            }
        }

        &.disabled {
            @mixin colors {
                color: #fff;
                background-color: #b3e19d;
                border-color: #b3e19d;
            }

            @include colors;
            &:hover,
            &:focus,
            &:active {
                @include colors;
            }
        }
    }

    // 信息按钮
    &--info {
        color: #fff;
        background-color: $info-color;
        border-color: $info-color;
        &:hover,
        &:focus {
            color: #fff;
            background-color: #a6a9ad;
            border-color: #a6a9ad;
        }
        &:active {
            color: #fff;
            background-color: #82848a;
            border-color: #82848a;
        }

        &.plain {
            color: $info-color;
            background-color: $info-lighter-color;
            border-color: #d3d4d6;
            &:hover,
            &:focus {
                color: #fff;
                background-color: $info-color;
                border-color: $info-color;
            }
            &:active {
                background-color: #82848a;
                border-color: #82848a;
            }

            &.disabled {
                @mixin colors {
                    color: #bcbec2;
                    background-color: #f4f4f5;
                    border-color: #e9e9eb;
                }

                @include colors;
                &:hover,
                &:focus,
                &:active {
                    @include colors;
                }
            }
        }

        &.disabled {
            @mixin colors {
                color: #fff;
                background-color: #c8c9cc;
                border-color: #c8c9cc;
            }

            @include colors;
            &:hover,
            &:focus,
            &:active {
                @include colors;
            }
        }
    }

    // 警告按钮
    &--warning {
        color: #fff;
        background-color: $warning-color;
        border-color: $warning-color;
        &:hover,
        &:focus {
            color: #fff;
            background-color: #ebb563;
            border-color: #ebb563;
        }
        &:active {
            color: #fff;
            background-color: #cf9236;
            border-color: #cf9236;
        }

        &.plain {
            color: $warning-color;
            background-color: $warning-lighter-color;
            border-color: #f5dab1;
            &:hover,
            &:focus {
                color: #fff;
                background-color: $warning-color;
                border-color: $warning-color;
            }
            &:active {
                background-color: #cf9236;
                border-color: #cf9236;
            }

            &.disabled {
                @mixin colors {
                    color: #f0c78a;
                    background-color: #fdf6ec;
                    border-color: #faecd8;
                }

                @include colors;
                &:hover,
                &:focus,
                &:active {
                    @include colors;
                }
            }
        }

        &.disabled {
            @mixin colors {
                color: #fff;
                background-color: #f3d19e;
                border-color: #f3d19e;
            }

            @include colors;
            &:hover,
            &:focus,
            &:active {
                @include colors;
            }
        }
    }

    // 危险按钮
    &--danger {
        color: #fff;
        background-color: $danger-color;
        border-color: $danger-color;
        &:hover,
        &:focus {
            color: #fff;
            background-color: #f78989;
            border-color: #f78989;
        }
        &:active {
            color: #fff;
            background-color: #dd6161;
            border-color: #dd6161;
        }

        &.plain {
            color: $danger-color;
            background-color: $danger-lighter-color;
            border-color: #fbc4c4;
            &:hover,
            &:focus {
                color: #fff;
                background-color: $danger-color;
                border-color: $danger-color;
            }
            &:active {
                background-color: #dd6161;
                border-color: #dd6161;
            }

            &.disabled {
                @mixin colors {
                    color: #f9a7a7;
                    background-color: #fef0f0;
                    border-color: #fde2e2;
                }

                @include colors;
                &:hover,
                &:focus,
                &:active {
                    @include colors;
                }
            }
        }

        &.disabled {
            @mixin colors {
                color: #fff;
                background-color: #fab6b6;
                border-color: #fab6b6;
            }

            @include colors;
            &:hover,
            &:focus,
            &:active {
                @include colors;
            }
        }
    }

    // 文字按钮
    &--text {
        @mixin bg-color {
            background-color: transparent;
            border: none;
        }

        color: $primary-color;
        padding-right: 0;
        padding-left: 0;
        @include bg-color;

        &:hover,
        &:focus,
        &:active {
            @include bg-color;
        }
        &:hover,
        &:focus {
            color: #66b1ff;
        }
        &:active {
            color: #3a8ee6;
        }
    }

    .moo-button__icon {
        font-size: inherit;
    }

    .moo-button__loading-icon {
        @keyframes rotating {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(1turn);
            }
        }

        font-size: inherit;
        display: inline-block;
        margin-right: 5px;
        animation: rotating 2s linear infinite;
    }
}
</style>
