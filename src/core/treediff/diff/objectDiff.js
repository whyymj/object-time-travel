const Immutable = require("immutable");
const typeOf = require('kind-of');
const isObject = require("isobject");
const deepClone = require('../copy/index.js').deepClone; //自定义的deepCopy,返回值可能是Immutable数据
/**
 * 判断是否基本数据类型
 * @param {*} value 
 * @returns 
 */
function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        value === null
    )
}
exports.isPrimitive = isPrimitive
/**
 * 返回数据的类型
 * @param {数据}} data 
 * @param {是否先将Immutable数据还原再判断} toJS 
 * @returns boolean
 */
function getDataType(data, toJS = false) {
    if (Immutable.isImmutable(data) && !toJS) {
        return 'Immutable ' + data.toString().split(' ')[0]
    }
    if (Immutable.isImmutable(data) && toJS) {
        data = data.toJS()
    }
    return typeOf(data)
}
exports.getDataType = getDataType

function isNotInThePath(parents, key, floor) {
    if (parents && parents.get(floor) !== undefined && parents.get(floor) != key) {
        return true
    }
    return false
}
/**
 * 找到两个相同结构的对象的差异内容，并返回包含所有差异的数组
 * 注意对象内的值只能是简单类型，复杂类型不考虑
 * @param obj1 原对象
 * @param obj2 可能修改过的对象
 * @param path 到达该节点的路径，值为key
 * @param type 到达该节点的路径，值为父节点类型
 * @param resultObj 对比出的差异，即最终结果
 * @param parents 筛选用的路径，不在进行路径外的差异对比
 * @param handler 下一层的处理函数
 * 
 * @returns {{}} 包含所有差异的数组
 */
function objectDiffHandler(obj1, obj2, path, type, resultObj = [], parents, handler) {

    if (getDataType(obj1) != getDataType(obj2)) { //类型不同
        resultObj.push({
            path,
            type: type.push(getDataType(obj1, true)),
            operation: 'update',
            value: {
                from: deepClone(obj1),
                to: deepClone(obj2),
            }
        });
    } else {
        if (isPrimitive(obj1) || isPrimitive(obj2)) { //基本数据类型
            if (obj1 !== obj2) {
                resultObj.push({
                    path,
                    type: type.push(getDataType(obj1, true)),
                    operation: 'update',
                    value: {
                        from: deepClone(obj1),
                        to: deepClone(obj2),
                    }
                });
            }
        } else { //引用数据类型
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
                    if (isNotInThePath(parents, key, path.size)) { //只是为了手动筛选对比路径用的
                        return
                    }
                    //将变化过的属性挂载到返回对象中
                    if (obj2.get(key) !== undefined) {
                        if (isObject(obj1.get(key)) && isObject(obj2.get(key))) { //如果是对象
                            if (typeof handler == 'function') {
                                handler(obj1.get(key), obj2.get(key), path.push(key), type.push(getDataType(obj1, true)), resultObj, parents, handler)
                            } else {
                                objectDiffHandler(obj1.get(key), obj2.get(key), path.push(key), type.push(getDataType(obj1, true)), resultObj, parents, handler)
                            }
                        } else { //
                            resultObj.push({
                                path: path.push(key),
                                operation: 'update',
                                type: type.push(getDataType(obj1, true)),
                                value: {
                                    from: deepClone(obj1.get(key)),
                                    to: deepClone(obj2.get(key)),
                                }
                            });
                        }
                    } else {
                        resultObj.push({
                            path: path.push(key),
                            operation: 'delete',
                            type: type.push(getDataType(obj1, true)),
                            value: {
                                from: deepClone(obj1.get(key)),
                                to: undefined,
                            }
                        });
                    }
                }
            });
            const keys2 = Object.keys(filteKeys2);
            //new有单old没有
            keys2.forEach(key => {
                key = key + '';
                if (isNotInThePath(parents, key, path.size)) {
                    return
                }
                if (obj1.get(key) !== obj2.get(key)) {
                    //将变化过的属性挂载到返回对象中
                    resultObj.push({
                        path: path.push(key),
                        operation: 'add',
                        type: type.push(getDataType(obj1, true)),
                        value: {
                            from: undefined,
                            to: deepClone(obj2.get(key)),
                        }
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
exports.objectDiff = function findOperate(olddata, newdata, path = []) {

    //比较obj1和obj2的差异
    const objOperateObj = objectDiffHandler(olddata, newdata, Immutable.List([]), Immutable.List([]), [], (path.length ? Immutable.List(path) : null));

    return Immutable.fromJS(objOperateObj).toJS();
}
exports.objectDiffHandler = objectDiffHandler;