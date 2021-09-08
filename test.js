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
recorder.pipe(data)
.watch('id', (value) => {
      console.log('id=',value)
  }).watch('child.info.txt', (value) => {
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
