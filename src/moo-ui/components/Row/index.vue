<script>
export default {
    name: 'MooRow',
    props: {
        gutter: {
            type: Number,
            default: 0
        },
        justify: {
            type: String,
            default: 'start'
        },
        align: {
            type: String
        },
        tag: {
            type: String,
            default: 'div'
        }
    },
    computed: {
        classList() {
            const list = ['moo-row'];
            if (this.justify) {
                list.push(`justify-${this.justify}`);
            }
            if (this.align) {
                list.push(`align-${this.align}`);
            }
            return list;
        },
        styles() {
            const style = {};
            if (this.gutter) {
                style.marginLeft = -this.gutter / 2 + 'px';
                style.marginRight = style.marginLeft;
            }
            return style;
        }
    },
    render(createElement) {
        return createElement(
            this.tag,
            {
                class: this.classList,
                style: this.styles
            },
            this.$slots.default
        );
    }
};
</script>

<style lang="scss">
.moo-row {
    display: flex;
    flex-wrap: wrap;

    &.justify-start {
        justify-content: flex-start;
    }
    &.justify-end {
        justify-content: flex-end;
    }
    &.justify-center {
        justify-content: center;
    }
    &.justify-space-around {
        justify-content: space-around;
    }
    &.justify-space-between {
        justify-content: space-between;
    }

    &.align-top {
        align-items: flex-start;
    }
    &.align-middle {
        align-items: center;
    }
    &.align-bottom {
        align-items: flex-end;
    }
}
</style>
