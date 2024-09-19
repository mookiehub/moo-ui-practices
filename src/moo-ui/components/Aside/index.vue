<template>
    <aside
        class="moo-aside"
        :style="{
            width
        }"
    >
        <slot></slot>
    </aside>
</template>

<script>
export default {
    name: 'MooAside',
    props: {
        width: {
            type: String,
            default: '300px'
        }
    }
};
</script>
