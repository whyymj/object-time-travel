 const findObjOperate = require('./src/core/treediff').findObjOperate
 const deepIs = require('deep-is')
 let res = findObjOperate({
     name: 'test',
     children: {
         id: 'child1',
         name: 'child2'
     },
     array: [1]
 }, {
     id: 1,
     children: {
         id: 'child1',
         name: 'child1'
     },
     array: [3,2],
     data:{}
 })
 console.log(res)
 
// const Immutable = require("immutable");
// let num = Immutable.fromJS([{
//     id: {
//         children: [1, 2]
//     }
// }]);
