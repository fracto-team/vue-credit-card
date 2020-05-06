<template>
    <div class="vcc-container">
        <CardPreview
                v-if="previewEnabled"
                :card-types="cardTypes"
                :card-number-field="cardNumber"
                :cvv-field="cvv"
                :expiry-month-field="expiryMonth"
                :expiry-year-field="expiryYear"
                :full-name-field="fullName"
                :hide-sensitive="sensitive">
        </CardPreview>
        <div class="vcc-row">
            <div class="vcc-col">
                <div class="vcc-form-group">
                    <input type="checkbox" v-model="sensitive" id="sensitive" class="vcc-checkbox-control">
                    <label class="vcc-label" for="sensitive">{{$t('form.sensitive')}}</label>
                </div>
            </div>
        </div>
        <div class="vcc-row">
            <div class="vcc-col">
                <div class="vcc-form-group">
                    <label class="vcc-label" for="holder">{{$t('form.holder')}}</label>
                    <input type="text" class="vcc-control"
                           :data-error="(cardErrors.cardFullName)"
                           id="holder" v-model="fullName" autocomplete="cc-name"/>
                    <div v-if="cardErrors.cardFullName" class="error">
                        <small>{{ $t('validation.cardFullName') }}</small>
                    </div>
                </div>
            </div>
            <div class="vcc-col">
                <div class="vcc-form-group">
                    <label class="vcc-label" for="number">{{$t('form.number')}}</label>
                    <card-number-field :data-error="(cardErrors.cardNumber)"
                                       class="vcc-control" v-model="cardNumber" id="number"/>
                    <div v-if="cardErrors.cardNumber" class="error">
                        <small>{{ $t('validation.cardNumber') }}</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="vcc-row">
            <div class="vcc-col">
                <div class="vcc-form-group">
                    <label class="vcc-label" for="expiryMonth">{{$t('form.expiryMonth')}}</label>
                    <select class="vcc-control" id="expiryMonth" v-model="expiryMonth"
                            :data-error="(cardErrors.cardExpiry)"
                            autocomplete="cc-exp-month">
                        <option :value="month.toString().padStart(2, '0')" v-for="month in 12" :key="month">
                            {{month}}
                        </option>
                    </select>
                    <div v-if="cardErrors.cardExpiry" class="error">
                        <small>{{ $t('validation.cardExpiry') }}</small>
                    </div>
                </div>
            </div>
            <div class="vcc-col">
                <div class="vcc-form-group">
                    <label class="vcc-label" for="expiryYear">{{$t('form.expiryYear')}}</label>
                    <select class="vcc-control" id="expiryYear" v-model="expiryYear"
                            :data-error="(cardErrors.cardExpiry)"
                            autocomplete="cc-exp-year">
                        <option :value="year.toString().slice(-2)" v-for="year in yearRange" :key="year">{{year}}
                        </option>
                    </select>
                    <div v-if="cardErrors.cardExpiry" class="error">
                        <small>{{ $t('validation.cardExpiry') }}</small>
                    </div>
                </div>
            </div>
            <div class="vcc-col">
                <div class="vcc-form-group">
                    <label class="vcc-label" for="cvv">{{$t('form.cvv')}}</label>
                    <input type="number" class="vcc-control" id="cvv" v-model="cvv" step="1" max="9999"
                           autocomplete="cc-csc" :data-error="(cardErrors.cardCvc)"
                           @input="cvvChanged"/>
                    <div v-if="cardErrors.cardCvc" class="error">
                        <small>{{ $t('validation.cardCvc') }}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CardPreview from './components/CardPreview';
    import CardNumberField from './components/CardNumberField';
    import {CARD_TYPES} from './contants/card_types_constants';
    import i18n from './i18n';
    import {VALIDATION} from "./validation/validation";

    export default {
        i18n,
        name: 'v-credit-card',
        components: {CardPreview, CardNumberField},
        props: {
            previewEnabled: {
                type: Boolean,
                default: true,
            },
            cardTypes: {
                type: Array,
                default: () => {
                    return CARD_TYPES;
                },
            },
            maxYear: {
                type: Number,
                default: 10,
            },
        },
        data() {
            return {
                cardNumber: '',
                cvv: '',
                expiryMonth: '',
                expiryYear: '',
                fullName: '',
                sensitive: false,
                yearRange: [],
                cardErrors: {},
            };
        },
        computed: {
            model() {
                return {
                    holder: this.fullName,
                    number: this.cardNumber,
                    month: this.expiryMonth ? this.expiryMonth.toString().padStart(1, '0') : this.expiryMonth,
                    year: this.expiryYear,
                    cvv: this.cvv,
                };
            },
        },
        watch: {
            fullName() {
                this.validate("fullName")
                this.$emit('input', this.model);
            },
            cardNumber() {
                this.validate("cardNumber")
                this.$emit('input', this.model);
            },
            expiryMonth() {
                this.validate("expiryMonth")
                this.$emit('input', this.model);
            },
            expiryYear() {
                this.validate("expiryYear")
                this.$emit('input', this.model);
            },
            cvv() {
                this.validate("cvc")
                this.$emit('input', this.model);
            },
        },
        mounted() {
            const maxYear = new Date().getUTCFullYear() + this.maxYear;
            for (let i = new Date().getUTCFullYear(); i <= maxYear; i++) {
                this.yearRange.push(i);
            }
        },
        methods: {
            validate(fieldName) {
                if (fieldName === 'cardNumber'){
                    this.cardErrors.cardNumber = !VALIDATION.validateCardNumber(this.cardNumber);
                }
                if (fieldName === 'fullName'){
                    this.cardErrors.cardFullName = !VALIDATION.validateFullName(this.fullName);
                }
                if (fieldName === 'cvc'){
                    this.cardErrors.cardCvc = !VALIDATION.validateCvc(this.cvv)
                }
                if (fieldName === 'expiryMonth' || fieldName === 'expiryYear'){
                    this.cardErrors.cardExpiry = !VALIDATION.validateExpiry(this.expiryMonth, this.expiryYear)
                }
            },
            cvvChanged($ev) {
                const max = parseInt($ev.target.max);
                if (this.cvv > max) {
                    this.cvv = max;
                }
            },
        },
    };
</script>
<style>
    .vcc-form-group {
        display: block;
    }

    .vcc-label {
        display: inline;
        font-size: 14px;
        line-height: 22px;
    }

    .vcc-control {
        display: block;
        width: 100%;
        margin: 0;
        border: 1px solid #cdcdcd;
        border-radius: 4px;
        padding: 6px;
        outline: none;
        box-sizing: border-box;
    }

    .vcc-checkbox-control {
        background-color: #fff;
        border: 1px solid #9d9d9d;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        height: 22px;
        width: 22px;
        font-size: 14px;
        line-height: 14px;
        text-align: center;
        padding: 4px;
        border-radius: 4px;
        display: inline-block;
        margin: 0 4px 0 0;
        color: #2d2d2d;
        outline: none;
    }

    .vcc-checkbox-control:after {
        content: '\00a0';
    }

    .vcc-checkbox-control:checked {
        background-color: #2d2d2d;
        color: #fff;
    }

    .vcc-checkbox-control:checked:after {
        content: '\2713';
        margin: 0;
        padding: 0;
    }

    .vcc-container {
        display: block;
        max-width: 320px;
        margin: 0 auto;
    }

    .vcc-row {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 0 0 6px 0;
    }

    .vcc-col {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        flex-basis: 160px;
        margin: 0;
        padding: 0 4px;
    }

    .vcc-form-group input[data-error="true"], select[data-error="true"] {
        border-color: #dc3545;
    }

    .vcc-form-group div.error {
        color: #f00;
    }
</style>
