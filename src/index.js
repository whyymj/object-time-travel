 
const findOperate=require('./core/treediff/index.js').findOperate
const user1 = [{id: 0, name: 'zhangsan', age: 18}, {id: 1, name: 'lisi', age: 19}, {id: 2, name: 'wangwu', age: 20}, {id: 3, name: 'wangwu', age: 20}];
const user2 = [{id: 0, name: 'zhangsan2', age: 19}, {id: 3, name: 'wangwu', age: 20}, {id: 4, name: 'xinren', age: 100}];
 
console.log( findOperate(user1,user2))