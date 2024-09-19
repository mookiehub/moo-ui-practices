<template>
    <div class="moo-button-group">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'MooButtonGroup'
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.moo-button-group {
    .moo-button {
        border-radius: 0;
        &:first-child {
            border-right-color: rgba(255, 255, 255, 0.5);
            border-top-left-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
        }
        &:last-child {
            border-left-color: rgba(255, 255, 255, 0.5);
            border-top-right-radius: $border-radius;
            border-bottom-right-radius: $border-radius;
        }

        &+.moo-button {
            margin-left: 0;
        }
    }
}
</style>
