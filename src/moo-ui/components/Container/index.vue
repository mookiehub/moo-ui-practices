<template>
    <section
        :class="[
            'moo-container',
            {
                'is-vertical': isVertical
            }
        ]"
    >
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'MooContainer',
    props: {
        direction: {
            validator(value) {
                if (!value) {
                    return true;
                }
                return ['horizontal', 'vertical'].includes(value);
            }
        }
    },
    computed: {
        isVertical() {
            if (this.direction === 'horizontal') {
                return false;
            }
            if (this.direction === 'vertical') {
                return true;
            }
            const defaultSlots = this.$slots.default || [];
            return defaultSlots.some(vnode => {
                const { tag } = vnode;
                return tag.endsWith('MooHeader') || tag.endsWith('MooFooter');
            });
        }
    }
};
</script>

<style lang="scss">
.moo-container {
    display: flex;
    flex: 1;

    &.is-vertical {
        flex-direction: column;

    }
}
</style>
