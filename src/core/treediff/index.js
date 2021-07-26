const Immutable = require("immutable")
/**
 * 判断对象是否为空
 * @param obj 对象
 * @returns {boolean} 为空返回true，不为空返回false
 */
function isEmptyObj(obj) {
    //如果对象的键数组的长度是0，表示为空对象
    return Object.keys(obj).length === 0;
}

function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

function getDataType(data) {
    if (Immutable.isImmutable(data)) {
        return 'Immutable ' + data.toString().split(' ')[0]
    }
    return Object.prototype.toString.call(data).split(' ')[1].replace(']', '')
}
/**
 * 找到两个相同结构的对象的差异内容，并返回包含所有差异的数组
 * 注意对象内的值只能是简单类型，复杂类型不考虑
 * @param obj1 原对象
 * @param obj2 可能修改过的对象
 * @returns {{}} 包含所有差异的数组
 */
function findObjOperate(obj1, obj2, path = [], resultObj = []) {

    if (getDataType(obj1) != getDataType(obj2)) {

        resultObj.push({
            path: [...path],
            operation: 'update',
            from: Immutable.fromJS(obj1),
            to: Immutable.fromJS(obj2),
        });
    } else {
        if (isPrimitive(obj1) || isPrimitive(obj2)) {
            if (obj1 !== obj2) {
                resultObj.push({
                    path: [...path],
                    operation: 'update',
                    from: Immutable.fromJS(obj1),
                    to: Immutable.fromJS(obj2),
                });
            }
        } else {

            obj1 = Immutable.fromJS(obj1)
            obj2 = Immutable.fromJS(obj2)

            const filteKeys2 = {};
            obj2.map((val, key) => {
                filteKeys2[key] = key
            })
            //old有但new可能没有或者不同
            obj1.map((val, key) => {
                delete filteKeys2[key];
                key = key + '';
                if (!Immutable.is(obj1.get(key), obj2.get(key))) {
                    //将变化过的属性挂载到返回对象中
                    if (obj2.get(key) !== undefined) {
                        if (typeof obj1.get(key) == 'object' && typeof obj2.get(key) == 'object') {
                            findObjOperate(obj1.get(key), obj2.get(key), [...path, key], resultObj)
                        } else {
                            resultObj.push({
                                path: [...path, key],
                                operation: 'update',
                                from: obj1.get(key),
                                to: obj2.get(key),
                            });
                        }

                    } else {
                        resultObj.push({
                            path: [...path, key],
                            operation: 'delete',
                            from: obj1.get(key),
                        });
                    }
                }
            });
            const keys2 = Object.keys(filteKeys2);
            //new有单old没有
            keys2.forEach(key => {
                key = key + '';
                if (obj1.get(key) !== obj2.get(key)) {
                    //将变化过的属性挂载到返回对象中
                    resultObj.push({
                        path: [...path, key],
                        to: obj2.get(key),
                        operation: 'add',
                    })

                }
            });
        }

    }
    return resultObj;
}

/**
 * 找到两个对象数组的差异，并打印从list1到list2的所有变化
 * 注意约定id不能修改
 * @param list1 原数组
 * @param list2 可能修改过的数组
 */
function findOperate(olddata, newdata) {

    //比较obj1和obj2的差异
    const objOperateObj = findObjOperate(olddata, newdata);
    //如果返回的对象为空对象，表示没有差异
    if (!isEmptyObj(objOperateObj)) {
        console.log('update', obj1.id, objOperateObj);
    }
    return objOperateObj;
}
exports.forward = function (data, operations) {
    if (typeof data == 'object') {
        operations.forEach(oper => {

        })
    } else {
        throw new Error('请输入Object')
    }

}
exports.findObjOperate = findObjOperate;
exports.findOperate = findOperate