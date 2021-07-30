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