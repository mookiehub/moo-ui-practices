import Row from './components/Row/index.vue';
import Col from './components/Col/index.vue';

import './styles/index.scss';

const components = [
    Row,
    Col
];

const install = Vue => {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
};

export default {
    install
};
export {
    Row,
    Col
};
