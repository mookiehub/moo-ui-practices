<template>
    <div class="moo-checkbox-group">
        <slot></slot>
    </div>
</template>

<script>
import { sizes } from '../../constants';

export default {
    name: 'MooCheckboxGroup',
    model: {
        event: 'change'
    },
    props: {
        value: Array,
        size: {
            type: String,
            validator: value => sizes.includes(value)
        },
        min: Number,
        max: Number,
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
