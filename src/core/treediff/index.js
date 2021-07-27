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

function getDataType(data,toJS=false) {
    if (Immutable.isImmutable(data)&&!toJS) {
        return 'Immutable ' + data.toString().split(' ')[0]
    }
    if (Immutable.isImmutable(data)&&toJS) {
        data=data.toJS()
    }
    return Object.prototype.toString.call(data).split(' ')[1].replace(']', '')
}

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
 * @returns {{}} 包含所有差异的数组
 */
function findObjOperate(obj1, obj2, path, type, resultObj = [], parents) {

    if (getDataType(obj1) != getDataType(obj2)) {
        resultObj.push({
            path,
            type:type.push(getDataType(obj1,true)),
            operation: 'update',
            value: {
                from: Immutable.fromJS(obj1),
                to: Immutable.fromJS(obj2),
            }
        });
    } else {
        if (isPrimitive(obj1) || isPrimitive(obj2)) {
            if (obj1 !== obj2) {
                resultObj.push({
                    path,
                    type:type.push(getDataType(obj1,true)),
                    operation: 'update',
                    value: {
                        from: Immutable.fromJS(obj1),
                        to: Immutable.fromJS(obj2),
                    }
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
                    if (isNotInThePath(parents, key, path.size)) {
                        return
                    }
                    //将变化过的属性挂载到返回对象中
                    if (obj2.get(key) !== undefined) {
                        if (typeof obj1.get(key) == 'object' && typeof obj2.get(key) == 'object') {
                            findObjOperate(obj1.get(key), obj2.get(key), path.push(key), type.push(getDataType(obj1,true)), resultObj, parents)
                        } else {
                            resultObj.push({
                                path: path.push(key),
                                operation: 'update',
                                type:type.push(getDataType(obj1,true)),
                                value: {
                                    from: obj1.get(key),
                                    to: obj2.get(key),
                                }
                            });
                        }
                    } else {
                        resultObj.push({
                            path: path.push(key),
                            operation: 'delete',
                            type:type.push(getDataType(obj1,true)),
                            value: {
                                from: obj1.get(key),
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
                        type:type.push(getDataType(obj1,true)),
                        value: {
                            from: undefined,
                            to: obj2.get(key),
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
function findOperate(olddata, newdata, path = []) {

    //比较obj1和obj2的差异
    const objOperateObj = findObjOperate(olddata, newdata, Immutable.List([]), Immutable.List([]), [], (path.length ? Immutable.List(path) : null));

    return Immutable.fromJS(objOperateObj).toJS();
}
exports.transfer = function (data, operations) {

    if (typeof data == 'object') {
        operations.forEach(oper => {
            let path = oper.path;
            let type=oper.type;
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
                    if(type[i+1]=='Array'){
                        child[path[i]]=[]
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
exports.findOperate = findOperate