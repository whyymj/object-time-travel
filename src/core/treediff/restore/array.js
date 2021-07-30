/**
 * 用来重现操作步骤，old=>new
 * @param {原数组} arr 
 * @param {操作步骤} operation 
 * @param {是否shallowCopy} copy 
 * @returns 
 */
exports.repeat = function repeat(arr, operation, copy = false) {
    let i = 0
    if (copy) {
        arr = [...arr]
    }
    operation.forEach(oper => {
        if (oper.operation == 'del') {
            arr.splice(i, 1)
        } else if (oper.operation == 'add') {
            arr.splice(i, 0, oper.value)
            i++
        } else {
            i++
        }
    })
    return arr
}
/**
 * 根据操作步骤还原数组;new=>old
 * @param {新数组} arr 
 * @param {操作步骤} operation 
 * @param {是否shallowCopy} copy 
 * @returns 
 */
exports.resume = function resume(arr, operation, copy = false) {
    let i = 0;
    if (copy) {
        arr = [...arr]
    }
    operation.forEach(oper => {
        if (oper.operation == 'del') {
            arr.splice(i, 0, oper.value);
            i++
        } else if (oper.operation == 'add') {
            arr.splice(i, 1);
        } else {
            i++
        }
    })
    return arr
}