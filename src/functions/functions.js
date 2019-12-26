import VMasker from 'vanilla-masker';

export function replaceAt(string = '', index = 0, replace = '') {
    return string.substr(0, index) + replace + string.substring(index + replace.length);
}

export function putSpacesEach(string = '', len = 1) {
    const reg = new RegExp('(.{' + len + '})', 'g');
    return string.replace(reg, '$1 ').trim();
}

export function getInitials(string = '', replace = '***', default_value = 'AD SOYAD') {
    const input = string && string.length > 0 ? string : default_value;
    return input.match(/^([\S])|\s([\S])/gm).join(replace).trim() + replace;
}

export function replaceDigits(string = '', replace = '*') {
    return string.replace(/\d/g, replace);
}

export function getCardType(cardNum) {
    let payCardType = '';
    const regexMap = [
        {regEx: /^4[0-9]{5}/ig, cardType: 'visa'},
        {regEx: /^5[1-5][0-9]{4}/ig, cardType: 'mastercard'},
        {regEx: /^3[47][0-9]{3}/ig, cardType: 'amex'},
        {regEx: /^(5[06-8]\d{4}|6\d{5})/ig, cardType: 'maestro'},
        {regEx: /^979/ig, cardType: 'troy'},
    ];

    for (let j = 0; j < regexMap.length; j++) {
        if (cardNum.match(regexMap[j].regEx)) {
            payCardType = regexMap[j].cardType;
            break;
        }
    }
    return payCardType;
}

export function maskCard(string = '') {
    return VMasker.toPattern(string, '9999 9999 9999 9999');
}
