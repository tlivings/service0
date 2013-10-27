'use strict';

/**
 * Extend an Object from another Object.
 * @param child
 * @param parent
 * @param proto - prototype mixins
 * @returns {*}
 */
module.exports = function (child, parent, proto) {
    //Constructor
    var properties = {
        constructor : {
            value : child
        }
    };

    //Mixin prototype properties
    if (proto) {
        Object.keys(proto).forEach(function (key) {
            properties[key] = {
                value : proto[key]
            }
        });
    }

    //Extend
    child.prototype = Object.create(parent.prototype, properties);

    //Convenience object
    child.super_ = parent;

    return child;
};