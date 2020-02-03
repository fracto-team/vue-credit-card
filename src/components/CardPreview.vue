<template>
    <div class="vcc-credit-card-preview">
        <div class="vcc-credit-card-front vcc-credit-card">
            <div class="vcc-credit-card-inner">
                <div class="vcc-credit-card-number vcc-text-shadow">
                    {{cardNumber || $t('placeholders.number')}}
                </div>
                <div class="vcc-credit-card-holder vcc-text-shadow">
                    {{cardHolder || $t('placeholders.holder')}}
                </div>
                <div class="vcc-credit-card-expiry-month vcc-text-shadow">
                    {{expiryMonth || $t('placeholders.expiryMonth')}}
                </div>
                <div class="vcc-credit-card-expiry-year vcc-text-shadow">
                    {{expiryYear || $t('placeholders.expiryYear')}}
                </div>
                <div class="vcc-credit-card-type">
                    <img :src="cardTypeImage" v-if="cardTypeImage" alt="Credit Card Type"
                         class="vcc-credit-card-type-image">
                    <span class="vcc-card-type-text" v-if="!cardTypeImage && cardType">{{cardType}}</span>
                </div>
            </div>
        </div>
        <div class="vcc-credit-card-back vcc-credit-card">
            <div class="vcc-credit-card-inner">
                <div class="vcc-credit-card-magnet">&nbsp;</div>
                <div class="vcc-credit-card-cvv">
                    {{cvv || $t('placeholders.cvv')}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getCardType, getInitials, putSpacesEach, replaceAt, replaceDigits} from '../functions/functions';

    export default {
        props: [
            'hideSensitive',
            'cardNumberField',
            'expiryMonthField',
            'expiryYearField',
            'fullNameField',
            'cvvField',
            'cardTypes',
        ],
        data() {
            return {};
        },
        computed: {
            cardType() {
                const card_type = getCardType(this.cardNumberField, this.cardTypes);

                return card_type ? card_type.name : null;
            },
            cardNumber() {
                if (this.hideSensitive && this.cardNumberField) {
                    return putSpacesEach(replaceAt(this.cardNumberField, 4, '********'), 4);
                }

                return putSpacesEach(this.cardNumberField, 4);
            },
            cardHolder() {
                if (this.hideSensitive && this.fullNameField) {
                    return getInitials(this.fullNameField);
                }
                return this.fullNameField;
            },
            cvv() {
                if (this.hideSensitive && this.cvvField) {
                    return replaceDigits(this.cvvField, '*');
                }

                return this.cvvField;
            },
            expiryMonth() {
                if (!this.expiryMonthField) {
                    return this.expiryMonthField;
                }
                if (this.hideSensitive && this.expiryMonthField) {
                    return getInitials(this.expiryMonthField, '*', '00');
                }

                return this.expiryMonthField.toString().padStart(2, '0');
            },
            expiryYear() {
                if (!this.expiryYearField) {
                    return this.expiryYearField;
                }
                if (this.hideSensitive && this.expiryYearField) {
                    return getInitials(this.expiryYearField, '*', '00');
                }

                return this.expiryYearField.toString().padStart(2, '0');
            },
            cardTypeImage() {
                const type = getCardType(this.cardNumberField, this.cardTypes);
                return type ? type.icon : null;
            },
        },
    };
</script>

<style>
    .vcc-credit-card-preview {
        position: relative;
        background-color: #fff;
        font-family: 'Ubuntu', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        height: 230px;
        margin-bottom: 12px;
    }

    .vcc-credit-card-preview .vcc-credit-card {
        width: 240px;
        height: 150px;
        position: absolute;
        background-color: #dbdbdb;
        border: 1px solid #cdcdcd;
        border-radius: 12px;
    }

    .vcc-credit-card-preview .vcc-credit-card-front {
        z-index: 2;
        -webkit-box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.4);
        -moz-box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.4);
        box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.4);
    }

    .vcc-credit-card-preview .vcc-credit-card-back {
        z-index: 1;
        top: 30px;
        left: 78px;
        background-color: #cacaca;
    }

    .vcc-credit-card-preview .vcc-credit-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .vcc-credit-card-preview .vcc-credit-card-magnet {
        position: absolute;
        top: 30px;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: #4a4a4a;
    }

    .vcc-credit-card-preview .vcc-credit-card-cvv {
        position: absolute;
        width: calc(14px * 3);
        font-size: 14px;
        line-height: 14px;
        text-align: center;
        height: 14px;
        padding: 6px;
        border: 1px solid #acacac;
        background-color: #fff;
        top: 100px;
        left: 170px;
    }

    .vcc-credit-card-preview .vcc-credit-card-holder {
        position: absolute;
        top: 100px;
        left: 14px;
        font-size: 14px;
        line-height: 14px;
        color: #2d2d2d;
        font-weight: bold;
        width: 210px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vcc-credit-card-preview .vcc-credit-card-expiry-month {
        position: absolute;
        top: 120px;
        right: 34px;
        font-size: 14px;
        line-height: 14px;
    }

    .vcc-credit-card-preview .vcc-credit-card-expiry-year {
        position: absolute;
        top: 120px;
        right: 20px;
        font-size: 14px;
        line-height: 14px;
    }

    .vcc-credit-card-preview .vcc-credit-card-expiry-month:after {
        content: '\00a0/\00a0\00a0';
    }

    .vcc-credit-card-preview .vcc-credit-card-number {
        position: absolute;
        width: 200px;
        top: 60px;
        left: calc(50% - calc(200px / 2));
        font-size: 20px;
        height: 20px;
        font-weight: bold;
        text-align: left;
        line-height: 22px;
    }

    .vcc-credit-card-preview .vcc-text-shadow {
        color: #2d2d2d;
        font-weight: bold;
        text-shadow: 2px 2px #fff;
    }

    .vcc-credit-card-preview .vcc-credit-card-type {
        position: absolute;
        top: 10px;
        right: 20px;
        width: 60px;
        height: 38px;
        background-color: #4a4a4a;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        line-height: 36px;
        text-transform: capitalize;
    }

    .vcc-credit-card-preview .vcc-credit-card-type .vcc-credit-card-type-image {
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }
</style>
