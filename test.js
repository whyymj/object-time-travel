//  const findObjOperate = require('./src/core/treediff').findOperate
//  const transfer = require('./src/core/treediff').transfer
//  const deepIs = require('deep-is')
//  let res = findObjOperate([{
//      name: 'test',
//      children: {
//          id: 'child1',
//          name: 'child2',
//          children:[{
//              id:'child22',
//              name:'ooo'
//          }]
//      },
//      array: [1]
//  }], [{
//      id: 1,
//      children: {
//          id: 'child1',
//          name: 'child1',
//          children:[{
//              id:'child21',
//              name:8888
//          }]
//      },
//      array: [3,2],
//      data:{}
//  }])
//  console.log(res)
//  console.log(JSON.stringify(transfer([],res)))
 
// const Immutable = require("immutable");
// let data={
//     info:{
//         test:1
//     }
// }
// let info = data.info;
// info.test=2
const myers=require("./src/core/treediff/myers")
let s1 = 'ABCABBA'.split('')
let s2 = 'CBABAC'.split('')

console.log(myers(s1, s2))