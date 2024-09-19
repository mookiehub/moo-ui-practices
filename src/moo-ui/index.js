import Row from './components/Row/index.vue';
import Col from './components/Col/index.vue';
import Container from './components/Container/index.vue';
import Header from './components/Header/index.vue';
import Aside from './components/Aside/index.vue';
import Main from './components/Main/index.vue';
import Footer from './components/Footer/index.vue';

import './styles/index.scss';

const components = [
    Row,
    Col,
    Container,
    Header,
    Aside,
    Main,
    Footer
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
    Col,
    Container,
    Header,
    Aside,
    Main,
    Footer
};
