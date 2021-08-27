'use strict';
const snapShot = require('./dist/index').default
// const deepequal = require('deep-equal') 

const reorder = new snapShot()
let data = {
    id: 0,
    list: [],
    child: {
        name: 'child',
        uuuid: 1,
        rii: 2
    }
};
let list = data.child
reorder.pipe(data)

for (let i = 0; i < 10; i++) {
    data.id = i;
    data.list.push(i);
    data.child.name = 'child' + i;
    data.say = function () {
        console.log(i, 'oooooo')
    }
    reorder.commit(i);
}

data.say()
console.log(JSON.stringify(data), list==data.list);






setTimeout(function () {
    reorder.reset(2)
    data.say()
    console.log(JSON.stringify(data), list);
}, 500)