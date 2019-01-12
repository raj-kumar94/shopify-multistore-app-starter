const moment = require('moment');


let registerHelpers = (hbs) => {

    /**
     * Handlebar helper for displaying the JSON data
     */
    hbs.registerHelper('substr', function (length, context, options) {
        const newStr = context.toString();

        if (newStr.length > length) {
            return newStr.substring(0, length);
        } else {
            return newStr;
        }
    });

    hbs.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });

    hbs.registerHelper('compare', function (lvalue, rvalue, options) {

        if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        let operator = options.hash.operator || "==";

        let operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        }

        if (!operators[operator])
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

        var result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    hbs.registerHelper('$inArray', function (s, a) {
        return s.indexOf(a) !== -1;
    });

};


module.exports = registerHelpers;