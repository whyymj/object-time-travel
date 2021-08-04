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
    child: [{
        id: "b",
        '@@_diff_id_@@':'b',
        name: 'bb'
    },{
        id: 'a',
        '@@_diff_id_@@':'a',
        name: 'aa'
    }],
    id: 'a'
}
let data2 = {
    child: [{
        id: "a",
        '@@_diff_id_@@':'a',
        name: 'a'
    },{
        id: "b",
        name: 'b',
        '@@_diff_id_@@':'b',
    },{
        id: "c",
        name: 'c',
        '@@_diff_id_@@':'c',
    }],
    id: 'b'
}
console.log(JSON.stringify(equal(data1, data2)))