export const CARD_TYPES = [
    {regEx: /^4[0-9]{5}/ig, name: 'visa', icon: require('../assets/visa_icon.png')},
    {regEx: /^5[1-5][0-9]{4}/ig, name: 'mastercard', icon: require('../assets/master_icon.png')},
    {regEx: /^3[47][0-9]{3}/ig, name: 'amex', icon: require('../assets/amex_icon.png')},
    {regEx: /^(5[06-8]\d{4}|6\d{5})/ig, name: 'maestro', icon: require('../assets/maestro_icon.png')},
    {regEx: /^979/ig, name: 'troy', icon: require('../assets/troy_icon.png')},
];
