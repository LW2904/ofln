const { save } = require('./ofln');

exports.save = exports.default = (target, opts = {}) => {
    const options = Object.assign({
        target,
    }, opts);

    return save(options);
};
