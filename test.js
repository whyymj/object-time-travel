'use strict';
const rollback = require('./dist/index').default;
const recorder = new rollback()
let data = {
    id: 0,
    list: [],
    child: {
        name: 'child',
    }
};
let list = data.child;//

recorder.pipe(data);// link

//start changing
for (let i = 0; i < 10; i++) {
    data.id = i;
    data.list.push(i);
    data.child.name = 'child' + i;
    data.say = function () {
        console.log(i, 'oooooo')
    }
    recorder.commit('commit '+ i);// record snap shot
}

//rollback 

setTimeout(function () {
    recorder.reset('commit '+ 3);
    data.say();// 3 oooooo
    console.log(list);// { name: 'child3' }
    console.log(data);//{ id: 3, list: [ 0, 1, 2, 3 ], child: { name: 'child3' }, say: [Function (anonymous)] }
}, 500)