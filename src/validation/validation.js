import {getCardType} from "../functions/functions";

export const VALIDATION = {
    validateFullName: function (fullName) {
        return (fullName !== '' && fullName != null && fullName.match(/^[a-zA-Z ğüşöçıİĞÜŞÖÇ]+$/));
    },

    validateCardNumber: function (cardNumber) {
        return !(getCardType(cardNumber) === null || cardNumber.length !== 16);
    },

    validateExpiry: function(month, year){
        if (!month || !year) { return false; }

        month = month.toString().trim();
        year = year.toString().trim();

        if (!/^\d+$/.test(month)) { return false; }
        if (!/^\d+$/.test(year)) { return false; }
        if (!(1 <= month && month <= 12)) { return false; }

        if (year.length === 2) {
            if (year < 70) {
                year = `20${year}`;
            } else {
                year = `19${year}`;
            }
        }

        if (year.length !== 4) { return false; }

        let expiry = new Date(year, month);
        let currentTime = new Date;

        // Months start from 0 in JavaScript
        expiry.setMonth(expiry.getMonth() - 1);

        // The cc expires at the end of the month,
        // so we need to make the expiry the first day
        // of the month after
        expiry.setMonth(expiry.getMonth() + 1, 1);

        return expiry > currentTime;
    },

    validateCvc: function (cvc) {
        if (!cvc) {
            return false;
        }
        cvc = cvc.toString().trim();
        if (!/^\d+$/.test(cvc)) {
            return false;
        }
        return (cvc.length >= 3) && (cvc.length <= 4);
    }
};
