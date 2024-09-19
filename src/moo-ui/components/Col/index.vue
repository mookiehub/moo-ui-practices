<script>
const offsetProps = ['offset', 'push', 'pull'];
const responsiveProps = ['xs', 'sm', 'md', 'lg', 'xl'];

export default {
    name: 'MooCol',
    props: {
        span: {
            type: Number,
            default: 24
        },
        offset: {
            type: Number,
            default: 0
        },
        push: {
            type: Number,
            default: 0
        },
        pull: {
            type: Number,
            default: 0
        },
        xs: [Number, Object],
        sm: [Number, Object],
        md: [Number, Object],
        lg: [Number, Object],
        xl: [Number, Object],
        tag: {
            type: String,
            default: 'div'
        }
    },
    computed: {
        gutter() {
            const parentName = this.$parent.$options.name;
            if (parentName === 'MooRow') {
                return this.$parent.gutter || 0;
            }
            return 0;
        },
        classList() {
            const list = ['moo-col'];
            list.push(`moo-col-${this.span}`);
            offsetProps.forEach(prop => {
                const value = this[prop];
                if (value) {
                    list.push(`moo-col-${prop}-${value}`);
                }
            });
            responsiveProps.forEach(prop => {
                const value = this[prop];
                if (typeof value === 'number') {
                    list.push(`moo-col-${prop}-${value}`);
                } else if (value instanceof Object) {
                    const keys = Object.keys(value);
                    keys.forEach(key => {
                        list.push(
                            key === 'span' ?
                            `moo-col-${prop}-${value[key]}` :
                            `moo-col-${prop}-${key}-${value[key]}`
                        );
                    });
                }
            });
            return list;
        },
        styles() {
            const style = {};
            if (this.gutter) {
                style.paddingLeft = this.gutter / 2 + 'px';
                style.paddingRight = style.paddingLeft;
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
.moo-col {
    position: relative;

    // 根据格数设置宽度和偏移值
    @for $i from 0 through 24 {
        &.moo-col-#{$i} {
            width: $i / 24 * 100%;
        }
        &.moo-col-offset-#{$i} {
            margin-left: $i / 24 * 100%;
        }
        &.moo-col-pull-#{$i} {
            left: -$i / 24 * 100%;
        }
        &.moo-col-push-#{$i} {
            left: $i / 24 * 100%;
        }
    }

    // xs
    @for $i from 0 through 24 {
        &.moo-col-xs-#{$i} {
            width: $i / 24 * 100%;
        }
        &.moo-col-xs-offset-#{$i} {
            margin-left: $i / 24 * 100%;
        }
        &.moo-col-xs-pull-#{$i} {
            left: -$i / 24 * 100%;
        }
        &.moo-col-xs-push-#{$i} {
            left: $i / 24 * 100%;
        }
    }
    // sm
    @media screen and (min-width: 768px) {
        @for $i from 0 through 24 {
            &.moo-col-sm-#{$i} {
                width: $i / 24 * 100%;
            }
            &.moo-col-sm-offset-#{$i} {
                margin-left: $i / 24 * 100%;
            }
            &.moo-col-sm-pull-#{$i} {
                left: -$i / 24 * 100%;
            }
            &.moo-col-sm-push-#{$i} {
                left: $i / 24 * 100%;
            }
        }
    }
    // md
    @media screen and (min-width: 992px) {
        @for $i from 0 through 24 {
            &.moo-col-md-#{$i} {
                width: $i / 24 * 100%;
            }
            &.moo-col-md-offset-#{$i} {
                margin-left: $i / 24 * 100%;
            }
            &.moo-col-md-pull-#{$i} {
                left: -$i / 24 * 100%;
            }
            &.moo-col-md-push-#{$i} {
                left: $i / 24 * 100%;
            }
        }
    }
    // lg
    @media screen and (min-width: 1200px) {
        @for $i from 0 through 24 {
            &.moo-col-lg-#{$i} {
                width: $i / 24 * 100%;
            }
            &.moo-col-lg-offset-#{$i} {
                margin-left: $i / 24 * 100%;
            }
            &.moo-col-lg-pull-#{$i} {
                left: -$i / 24 * 100%;
            }
            &.moo-col-lg-push-#{$i} {
                left: $i / 24 * 100%;
            }
        }
    }
    // xl
    @media screen and (min-width: 1920px) {
        @for $i from 0 through 24 {
            &.moo-col-xl-#{$i} {
                width: $i / 24 * 100%;
            }
            &.moo-col-xl-offset-#{$i} {
                margin-left: $i / 24 * 100%;
            }
            &.moo-col-xl-pull-#{$i} {
                left: -$i / 24 * 100%;
            }
            &.moo-col-xl-push-#{$i} {
                left: $i / 24 * 100%;
            }
        }
    }
}
</style>
