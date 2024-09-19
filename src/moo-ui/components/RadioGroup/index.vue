<template>
    <div class="moo-radio-group">
        <slot></slot>
    </div>
</template>

<script>
import { sizes } from '../../constants';

export default {
    name: 'MooRadioGroup',
    model: {
        event: 'change'
    },
    props: {
        value: [String, Number, Boolean],
        size: {
            type: String,
            validator: value => sizes.includes(value)
        },
        disabled: Boolean,
        textColor: {
            type: String,
            default: '#fff'
        },
        fill: {
            type: String,
            default: '#409eff'
        }
    },
    methods: {
        change(value) {
            this.$emit('change', value);
        }
    }
};
</script>

<style lang="scss">
.moo-radio-group {
    display: inline-block;
}
</style>
