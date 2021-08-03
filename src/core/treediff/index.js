const Immutable = require("immutable")
/**
 * 找到两个对象数组的差异，并打印从list1到list2的所有变化
 * 注意约定id不能修改
 * @param list1 原数组
 * @param list2 可能修改过的数组
 */
exports.transfer = function (data, operations) {

    if (typeof data == 'object') {
        operations.forEach(oper => {
            let path = oper.path;
            let type = oper.type;
            if (Immutable.isList(path)) {
                path = path.toJS();
            }
            if (Immutable.isList(type)) {
                type = type.toJS();
            }
            let child = data;
            for (let i = 0; i < path.length - 1; i++) {
                if (typeof child[path[i]] != 'object') {
                    child[path[i]] = {}
                    if (type[i + 1] == 'Array') {
                        child[path[i]] = []
                    }
                }
                child = child[path[i]];
            }
            if (oper.operation == 'add') {
                child[path[path.length - 1]] = Immutable.isCollection(oper.value.to) ? oper.value.to.toJS() : oper.value.to;

            } else if (oper.operation == 'update') {
                child[path[path.length - 1]] = Immutable.isCollection(oper.value.to) ? oper.value.to.toJS() : oper.value.to;

            } else if (oper.operation == 'delete') {
                delete child[path[path.length - 1]];

            }
        })
    } else {
        throw new Error('请输入Object')
    }
    return data

}