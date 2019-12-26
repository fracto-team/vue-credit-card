<template>
    <input type="text" :value="display" @keydown="inputNumber($event)" @input="onUpdate($event)"/>
</template>
<script>
    import {maskCard} from '../functions/functions';

    export default {
        props: ['value'],
        data() {
            return {
                focused: false,
                input: this.value,
                display: '',
            };
        },
        methods: {
            inputNumber(event) {
                const allowedCodes = ['Delete', 'Tab', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                if (allowedCodes.includes(event.code)) {
                    return true;
                }
                if (event.code === 'KeyA' && event.ctrlKey) {
                    return true;
                }
                if (event.code === 'KeyC' && event.ctrlKey) {
                    return true;
                }
                if (event.code === 'KeyV' && event.ctrlKey) {
                    return true;
                }
                if (event.code === 'Insert' && event.shiftKey) {
                    return true;
                }
                if (event.code === 'Space')
                    event.preventDefault();
                if (event.key && isNaN(event.key.trim()))
                    event.preventDefault();
                if (this.input.length === 16)
                    event.preventDefault();
            },
            onUpdate(event) {
                this.input = event.target.value.replace(/\s/g, '');
            },
            mask() {
                this.display = maskCard(this.input);
            },
        },
        watch: {
            input() {
                this.mask();
                this.$emit('input', this.input);
            },
        },
        mounted() {
            this.mask();
        },
    };
</script>
