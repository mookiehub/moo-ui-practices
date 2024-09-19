<template>
    <a
        :class="[
            'moo-link',
            {
                [`moo-link--${type}`]: type,
                underline,
                disabled
            }
        ]"
        :href="href"
        v-bind="$attrs"
        @click="handleClick"
    >
        <slot></slot>
    </a>
</template>

<script>
import { themeTypes } from '../../constants';

export default {
    name: 'MooLink',
    props: {
        type: {
            type: String,
            validator: value => themeTypes.includes(value)
        },
        underline: {
            type: Boolean,
            default: true
        },
        disabled: Boolean,
        href: String
    },
    methods: {
        handleClick(event) {
            if (this.disabled) {
                return;
            }
            this.$emit('click', event);
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-link {
    color: $regular-text-color;
    font-size: 14px;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    &:hover {
        color: $primary-color;
    }

    &.underline:hover {
        text-decoration: underline;
    }

    &.disabled {
        color: $placeholder-color;
        text-decoration: none;
        cursor: not-allowed;
        &.underline:hover {
            text-decoration: none;
        }
    }

    &--primary {
        color: $primary-color;
        &:hover {
            color: #66b1ff;
        }
        &.disabled {
            color: #a0cfff;
            &:hover {
                color: #a0cfff;
            }
        }
    }
    &--success {
        color: $success-color;
        &:hover {
            color: #85ce61;
        }
        &.disabled {
            color: #b3e19d;
            &:hover {
                color: #b3e19d;
            }
        }
    }
    &--warning {
        color: $warning-color;
        &:hover {
            color: #ebb563;
        }
        &.disabled {
            color: #f3d19e;
            &:hover {
                color: #f3d19e;
            }
        }
    }
    &--danger {
        color: $danger-color;
        &:hover {
            color: #f78989;
        }
        &.disabled {
            color: #fab6b6;
            &:hover {
                color: #fab6b6;
            }
        }
    }
    &--info {
        color: $info-color;
        &:hover {
            color: #a6a9ad;
        }
        &.disabled {
            color: #c8c9cc;
            &:hover {
                color: #c8c9cc;
            }
        }
    }
}
</style>
