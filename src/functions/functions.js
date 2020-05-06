import VMasker from 'vanilla-masker';
import {CARD_TYPES} from '../contants/card_types_constants';

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

export function getCardType(cardNum, cardTypes = []) {
    if (!cardTypes.length) {
        cardTypes = CARD_TYPES;
    }
    let cardType = null;
    for (let j = 0; j < cardTypes.length; j++) {
        if (cardNum.match(cardTypes[j].regEx)) {
            cardType = cardTypes[j];
            break;
        }
    }
    return cardType;
}

export function maskCard(string = '') {
    return VMasker.toPattern(string, '9999 9999 9999 9999');
}
