const cloneDeep = require('deepcopy');
const Immutable = require("immutable")
exports.deepClone = function (data) {
    if (Immutable.isImmutable(data)) {
        return data
    }
    let copy = Immutable.fromJS(data)
    if (copy === data) {
        console.log(data,'..,,',cloneDeep(data))
        return cloneDeep(data)
    }
    return copy
};