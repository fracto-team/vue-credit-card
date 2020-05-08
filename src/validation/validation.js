'use strict';

let ValidationBag = require('./validation-bag');
let Rule = require('./rule');
let Validator = require('./validator');
let mixin = require('./mixin');
let utils = require('./utils');

/* plugin install
 ----------------------------------- */

function install(Vue, options) {
    Vue.mixin(mixin);
    if (options && options.templates) {
        extendTemplates(options.templates);
    }
    if (options && options.mode) {
        setMode(options.mode);
    }
    if (options && options.Promise) {
        mixin.Promise = options.Promise;
    }
}

function extendTemplates(newTemplates) {
    Object.keys(newTemplates).forEach(function (key) {
        utils.templates[key] = newTemplates[key];
    });
}

function setMode(mode) {
    /*
    Vue.use(Validation, {mode: 'manual'};
    Validation.setMode("manual");

    interactive: The default mode is interactive, in this mode, the library will actively update
                 validation results when the user makes changes to the form. Normally the validation happens
                 immediately when the user is typing, but this can be delayed if v-model.lazy is used.

    manual: The second mode is manual, in this mode, the validation is triggered
            only when $validate() method is explicitly called.

    conservative: The last mode is conservative, in this mode, the validation is passive at first,
                  just the same as manual mode. But once the $validate() method is called,
                  it becomes active and acts exactly like interactive mode.
    */
    if (mode !== 'interactive' && mode !== 'conservative' && mode !== 'manual') {
        throw new Error('Invalid mode: ' + mode);
    }
    utils.mode = mode;
}

function setWork(value) {
    if (value !== 'true' && value !== 'false') {
        throw new Error('Invalid work type: ' + value);
    }
    utils.work = value
}

/* exports
 ----------------------------------- */

module.exports.name = 'Validation';
module.exports.ValidationBag = ValidationBag;
module.exports.Rule = Rule;
module.exports.Validator = Validator;
module.exports.mixin = mixin;
module.exports.install = install;
module.exports.extendTemplates = extendTemplates;
module.exports.setMode = setMode;
module.exports.setWork = setWork;