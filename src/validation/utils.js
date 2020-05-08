'use strict';

let deepEqual = require('deep-equal');

module.exports.debounce = function (func, wait, immediate) {
    let timeout;

    return function () {
        let context = this;
        let args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};

module.exports.format = function (template) {
    let args = Array.prototype.slice.call(arguments, 1);
    return template.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

module.exports.isArray = function (arg) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arg);
    }

    return Object.prototype.toString.call(arg) === '[object Array]';
};

module.exports.isEmpty = function (value) {
    if (module.exports.isArray(value)) {
        return !value.length;
    } else if (value === undefined || value === null) {
        return true;
    } else {
        return !String(value).trim().length;
    }
};

module.exports.isEqual = function (o1, o2) {
    return deepEqual(o1, o2);
};

module.exports.isFunction = function (arg) {
    return typeof arg === 'function';
};

module.exports.isNaN = function (arg) {
    return /^\s*$/.test(arg) || isNaN(arg);
};

module.exports.isNull = function (arg) {
    return arg === null;
};

module.exports.isString = function (arg) {
    return typeof arg === 'string' || arg instanceof String;
};

module.exports.isUndefined = function (arg) {
    return typeof arg === 'undefined';
};

module.exports.omit = function omit(obj, key) {
    let result = {};
    Object.keys(obj).forEach(name => {
        if (name !== key) {
            result[name] = obj[name];
        }
    });
    return result;
};

module.exports.templates = require('./templates');
module.exports.mode = 'interactive';
module.exports.work = 'true';
