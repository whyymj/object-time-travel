# object-time-travel


## Installation

Using npm:
```shell
$ npm i --save object-time-travel
```

In Node.js:

```js
const rollback = require('object-time-travel').default;
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

//rollback test
setTimeout(function () {
    recorder.reset('commit '+ 3);
    data.say();// 3 oooooo
    console.log(list);// { name: 'child3' }
    console.log(data);//{ id: 3, list: [ 0, 1, 2, 3 ], child: { name: 'child3' }, say: [Function (anonymous)] }
}, 500)
```


In Node.js:

Here is an example of Partial reduction ; you can only rollback several fields every time;

```js
const rollback = require('object-time-travel').default;
const recorder = new rollback()
let data = {
    id: 1,
    list: [],
    child: {
        name: 1,
        info: {
            txt: ''
        }
    }
}
recorder.pipe(data); // link

//start changing
for (let i = 0; i < 10; i++) {
    data.id = i;
    data.list.push(i);
    data.child.name = 'child' + i;
    data.child.info.txt = 'txt=' + i;

    recorder.commit('commit ' + i); // record snap shot
}

//first rollback [id,child] to 'commit 3'
recorder.reset('commit ' + 3, {
    paths: ['id', 'child'], //rollback these fields; it's invalid to array's index,such as 'list.0' will not work
    ignore: ['child.info'], //but ignore these fields;
});

//then rollback [list] to 'commit 6'
recorder.reset('commit ' + 6, {
    paths: ['list'], //rollback these fields; it's invalid to array's index,such as 'list.0' will not work
});

console.log(data)

// final result 
// {
//     id: 3, //commit 3
//     list:  [ 0, 1, 2, 3, 4, 5 ,6], //commit 6
//     child: { 
//          name: 'child3', //commit 3 
//          info: { txt: 'txt=9' }  //commit 9
    // }
// }
```
