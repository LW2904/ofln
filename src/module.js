const { save } = require('./ofln');

exports.save = exports.default = (target, opts = {}) => {
    const options = typeof target === 'string' ? Object.assign({
        target,
    }, opts) : target;

    return save(options);
};
