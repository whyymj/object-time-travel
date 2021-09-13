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
recorder.pipe(data)
.watch('id', (value) => { //when your reset makes this field change,it runs;
      console.log('id=',value)
})
.watch('child.info.txt', (value) => { //when your reset makes this field change,it runs;
     console.log('child.info.txt=',value)
}) ; // link

//start changing
for (let i = 0; i < 10; i++) {
    data.id = i;
    data.list.push(i);
    data.child.name = 'child' + i;
    data.child.info.txt = 'txt=' + i;
    recorder.commit('commit ' + i); // record snap shot
}

 data.child={}
 recorder.commit('clear child'); // record snap shot

//first rollback [id,child] to 'commit 3'
recorder.reset('commit ' + 3, {
    paths: ['id', 'child'], //rollback these fields; it's invalid to array's index,such as 'list.0' will not work
    ignore: ['child.info'], //but ignore these fields;
});

console.log(data)

// result 
// {
//     id: 3, //commit 3
//     list:  [ 0, 1, 2, 3, 4, 5 ,6 ,7,8,9], // commit 9;because option.paths didn't allow;
//     child: { 
//          name: 'child3', //commit 3 ; here child.info is ignored and it has been deleted by commit 'clear child'
    // }
// }

recorder.reset('clear child'); 
console.log(data)
//  

// { 
//     id: 9, 
//     list: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
//     child: {}
// }
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

recorder.reset('commit 3', {
    async: {
        'list': (cb) => {
            setTimeout(() =>{
                cb([11, 22, 33])
                console.log(data);
                // {
                //     id: 3,
                //     list: [ 11, 22, 33 ],
                //     child: { name: 'child3', info: { txt: 'txt=3' } }
                // }
            },1000)
        }
    }
})

console.log(data);
// {
//     id: 3,
//     list: [ 0, 1, 2, 3 ],
//     child: { name: 'child3', info: { txt: 'txt=3' } }
// }
```

All suggestions and opinions are welcome.

QQ:454413790 

Email: 454413790@qq.com