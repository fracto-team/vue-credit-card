'use strict';

const utils = require('./utils');
const ValidationBag = require('./validation-bag');

let mixin = {

    Promise: null,

    beforeMount: function () {
        this.$setValidators(this.$options.validators);

        if (this.validation) {
            // set vm to validation
            this.validation._setVM(this);
        }
    },

    beforeDestroy: function () {
        unwatch(this.$options.validatorsUnwatchCallbacks);
    },

    data: function () {
        if (this.$options.validators) {
            return {
                validation: new ValidationBag()
            };
        }
        return {};
    },

    methods: {
        $setValidators: function (validators) {
            unwatch(this.$options.validatorsUnwatchCallbacks);
            let validateMethods = {};
            this.$options.validateMethods = validateMethods;
            let unwatchCallbacks = [];
            this.$options.validatorsUnwatchCallbacks = unwatchCallbacks;
            if (validators && utils.work === 'true') {
                Object.keys(validators).forEach(function (key) {
                    let properties = key.split(',');
                    properties = properties.map(function (property) {
                        return property.trim();
                    });
                    let getters = properties.map(function (property) {
                        return generateGetter(this, property);
                    }, this);
                    let validator = validators[key];
                    let options = {};
                    if (!utils.isFunction(validator)) {
                        options = utils.omit(validator, 'validator');
                        validator = validator.validator;
                    }
                    if (options.cache) {
                        let option = options.cache === 'last' ? 'last' : 'all';
                        validator = cache(validator, option);
                    }
                    let validation = this.validation;
                    let validateMethod = function () {
                        if (utils.mode === 'conservative' && !validation.activated) {
                            return getPromise().resolve(false);
                        }
                        let args = getters.map(function (getter) {
                            return getter();
                        });
                        let rule = validator.apply(this, args);
                        if (rule) {
                            if (!rule._field) {
                                // field defaults to the first property
                                rule.field(properties[0]);
                            }
                            return this.validation.checkRule(rule);
                        } else {
                            return getPromise().resolve(false);
                        }
                    }.bind(this);

                    validateMethods[properties[0]] = validateMethod;

                    let validateMethodForWatch = validateMethod;
                    if (options.debounce) {
                        let decoratedValidateMethod = function () {
                            if (decoratedValidateMethod.sessionId !== this.validation.sessionId) {
                                return getPromise().resolve(false);
                            }
                            return validateMethod.apply(this, arguments);
                        }.bind(this);
                        let debouncedValidateMethod = utils.debounce(decoratedValidateMethod, parseInt(options.debounce));
                        let field = properties[0];
                        validateMethodForWatch = function () {
                            this.validation.resetPassed(field);
                            decoratedValidateMethod.sessionId = this.validation.sessionId;
                            debouncedValidateMethod.apply(this, arguments);
                        }.bind(this);
                    }
                    if (utils.mode !== 'manual') {
                        watchProperties(this, properties, validateMethodForWatch).forEach(function (unwatch) {
                            unwatchCallbacks.push(unwatch);
                        });
                    }
                }, this);
            }
        },
        $validate: function (fields) {
            if (this.validation._validate) {
                return this.validation._validate;
            }
            this.validation.activated = true;
            let validateMethods = this.$options.validateMethods;
            if (utils.isUndefined(fields)) {
                validateMethods = Object.keys(validateMethods).map(function (key) {
                    return validateMethods[key];
                });
            } else {
                fields = utils.isArray(fields) ? fields : [fields];
                validateMethods = fields.map(function (field) {
                    return validateMethods[field];
                });
            }
            if (utils.isEmpty(validateMethods)) {
                return getPromise().resolve(true);
            } else {
                let always = function () {
                    this.validation._validate = null;
                }.bind(this);
                this.validation._validate = getPromise()
                    .all(validateMethods.map(function (validateMethod) {
                        return validateMethod();
                    }))
                    .then(function (results) {
                        always();
                        return results.filter(function (result) {
                            return !!result;
                        }).length <= 0;
                    }.bind(this))
                    .catch(function (e) {
                        always();
                        throw e;
                    });
                return this.validation._validate;
            }
        }
    }
};

function unwatch(list) {
    if (list) {
        list.forEach(function (unwatch) {
            unwatch();
        });
    }
}

function generateGetter(vm, property) {
    let names = property.split('.');
    return function () {
        let value = vm;
        for (let i = 0; i < names.length; i++) {
            if (utils.isNull(value) || utils.isUndefined(value)) {
                break;
            }
            value = value[names[i]];
        }
        return value;
    };
}

function watchProperties(vm, properties, callback) {
    return properties.map(function (property) {
        return vm.$watch(property, function () {
            vm.validation.setTouched(property);
            callback.call();
        });
    });
}

function cache(validator, option) {
    return function () {
        let cache = validator.cache;
        if (!cache) {
            cache = [];
            validator.cache = cache;
        }
        let args = Array.prototype.slice.call(arguments);
        let cachedResult = findInCache(cache, args);
        if (!utils.isUndefined(cachedResult)) {
            return cachedResult;
        }
        let result = validator.apply(this, args);
        if (!utils.isUndefined(result)) {
            if (result.then) {
                return result.tab(function (promiseResult) {
                    if (!utils.isUndefined(promiseResult)) {
                        if (option !== 'all') {
                            cache.splice(0, cache.length);
                        }
                        cache.push({args: args, result: promiseResult});
                    }
                });
            } else {
                if (option !== 'all') {
                    cache.splice(0, cache.length);
                }
                cache.push({args: args, result: result});
                return result;
            }
        }
    };
}

function getPromise() {
    if (mixin.Promise) {
        return mixin.Promise;
    }
    return require('es6-promise').Promise;
}

function findInCache(cache, args) {
    let items = cache.filter(function (item) {
        return utils.isEqual(args, item.args);
    });
    if (!utils.isEmpty(items)) {
        return items[0].result;
    }
}

module.exports = mixin;
