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
let map1=new Map();
map1.set('id','a')
let map2=new Map();
map2.set('id','b')
class Test{
    id='test'
    constructor(id){
        this.id=id

    }
}
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
    id: 'a',
    map:map1,
    ttt:new Test('aaa')
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
    id: 'b',
    map:map2,
    ttt:new Test('bbb')
}
console.log(JSON.stringify(equal(data1, data2)))
console.log(JSON.stringify(new Test('44')))