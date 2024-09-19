<template>
    <footer
        class="moo-footer"
        :style="{
            height
        }"
    >
        <slot></slot>
    </footer>
</template>

<script>
export default {
    name: 'MooFooter',
    props: {
        height: {
            type: String,
            default: '60px'
        }
    }
};
</script>
