import Vue from 'vue';
import Validation from './validation/validation';

Vue.use(Validation, {
    work: 'true'
});

export let validate = Validation
