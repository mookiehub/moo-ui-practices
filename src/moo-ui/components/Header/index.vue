<template>
    <header
        class="moo-header"
        :style="{
            height
        }"
    >
        <slot></slot>
    </header>
</template>

<script>
export default {
    name: 'MooHeader',
    props: {
        height: {
            type: String,
            default: '60px'
        }
    }
};
</script>
