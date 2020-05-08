'use strict';
let utils = require('./utils');

function Rule(templates) {
    this._field = '';
    this._value = undefined;
    this._messages = [];
    if (templates) {
        this.templates = {};
        Object.keys(utils.templates).forEach(function (key) {
            this.templates[key] = utils.templates[key];
        }.bind(this));
        Object.keys(templates).forEach(function (key) {
            this.templates[key] = templates[key];
        }.bind(this));
    } else {
        this.templates = utils.templates;
    }
}

Rule.prototype.field = function (field) {
    this._field = field;
    return this;
};

Rule.prototype.value = function (value) {
    this._value = value;
    return this;
};

Rule.prototype.custom = function (callback, context) {
    let message = context ? callback.call(context) : callback();
    if (message) {
        if (message.then) {
            let that = this;
            message = Promise.resolve(message)
                .then(function (result) {
                    return result;
                })
                .catch(function (e) {
                    console.error(e.toString());
                    return that.templates.error;
                });
        }
        this._messages.push(message);
    }
    return this;
};

Rule.prototype._checkValue = function () {
    if (this._value === undefined) {
        throw new Error('Validator.value not set');
    }
    return this._value;
};

Rule.prototype.validCreditCard = function (value) {
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    let nCheck = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (let n = value.length - 1; n >= 0; n--) {
        let cDigit = value.charAt(n),
            nDigit = parseInt(cDigit, 10);

        if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) === 0;
}

Rule.prototype.required = function (message) {
    let value = this._checkValue();
    if (utils.isEmpty(value)) {
        this._messages.push(message || this.templates.required);
    }
    return this;
};

Rule.prototype.cardNumber = function (message) {
    let value = this._checkValue();
    if (!utils.isEmpty(value) && !this.validCreditCard(value)) {
        this._messages.push(message || utils.format(this.templates.cardNumber, message));
    }
    return this;
};

Rule.prototype.cardExpiry = function (message){
    let value = this._checkValue();
    if (!utils.isEmpty(value)) {
        let month = value.substring(0, 2)
        let year = value.slice(-2)
        if (year.length === 2) {
            if (year < 70) {
                year = `20${year}`;
            } else {
                year = `19${year}`;
            }
        }
        let expiry = new Date(parseInt(year), month);
        let currentTime = new Date;

        // Months start from 0 in JavaScript
        expiry.setMonth(expiry.getMonth() - 1);

        // The cc expires at the end of the month,
        // so we need to make the expiry the first day
        // of the month after
        expiry.setMonth(expiry.getMonth() + 1, 1);
        if (!/^\d+$/.test(month) || !/^\d+$/.test(month) || !/^\d+$/.test(year) || expiry < currentTime){
            this._messages.push(message || utils.format(this.templates.cardExpiry, message));
        }
    }
    return this;
}

Rule.prototype.length = function (length, message) {
    let value = this._checkValue();
    if (!utils.isEmpty(value) && String(value).length !== length) {
        this._messages.push(utils.format(message, length) || utils.format(this.templates.length, length));
    }
    return this;
};

Rule.prototype.minLength = function (length, message) {
    let value = this._checkValue();
    if (!utils.isEmpty(value) && String(value).length < length) {
        this._messages.push(utils.format(message, length) || utils.format(this.templates.minLength, length));
    }
    return this;
};

Rule.prototype.maxLength = function (length, message) {
    let value = this._checkValue();
    if (!utils.isEmpty(value) && String(value).length > length) {
        this._messages.push(utils.format(message, length) || utils.format(this.templates.maxLength, length));

    }
    return this;
};

Rule.prototype.lengthBetween = function (minLength, maxLength, message) {
    let value = this._checkValue();
    if (!utils.isEmpty(value)) {
        let string = String(value);
        if (string.length < minLength || string.length > maxLength) {
            this._messages.push(utils.format(message, minLength, maxLength) || utils.format(this.templates.lengthBetween, minLength, maxLength));
        }
    }
    return this;
};

Rule.prototype.regex = function (regex, message) {
    let value = this._checkValue();
    if (!utils.isEmpty(value)) {
        if (utils.isString(regex)) {
            regex = new RegExp(regex);
        }
        if (!regex.test(value)) {
            this._messages.push(message || this.templates.regex);
        }
    }
    return this;
};

module.exports = Rule;
