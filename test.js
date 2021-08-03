var equal = require('./src/core/treediff/diff/index').diff;
let a = 'avbc'.split('').map((item) => {
    return {
        value: item
    }
})
let b = 'adebc'.split('').map((item) => {
    return {
        value: item
    }
})
let data1 = {
    child: a,
    id: 'a'
}
let data2 = {
    child: b,
    id:'b'
}
console.log(equal(data1, data2))