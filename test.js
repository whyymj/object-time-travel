 const Immutable = require('immutable')
 const rollback = require('./dist/index').default;
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
 recorder.pipe(data).watch('id', (value) => {
     console.log('id=',value)
 }).watch('child.info.txt', (value) => {
    console.log('child.info.txt=',value)
})  // link

 //start changing
 for (let i = 0; i < 10; i++) {
     data.id = i;
     data.list.push(i);
     data.child.name = 'child' + i;
     data.child.info.txt = '' + i;

     recorder.commit('commit ' + i); // record snap shot
 }

 //Partial reduction test

 recorder.reset('commit ' + 3, {
     paths: [], //rollback these fields; it's invalid to array's index,such as 'list.0' will not work
     ignore: [], //but ignore these fields;
 });
 recorder.reset('commit ' + 6, {
     paths: ['list'], //rollback these fields; it's invalid to array's index,such as 'list.0' will not work
 });
 console.log(data)
 //result 
 // {
 //     id: 3,
 //     list:  [ 0, 1, 2, 3, 4, 5 ,6],
 //     child: { name: 'child3', info: { txt: 'txt=9' } }
 // }

