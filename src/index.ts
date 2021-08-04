 
// const Immutable = require('immutable')
 
// interface OperationRecord {
//     index: number;//操作序列
//     hash: number;//data的hash值
//     timestamp: number;//操作的时间戳
// }

// interface Operations {
//     storage:any;//最终缓存
//     cache: OperationRecord[];//临时记录
//     oldValue:Object;//
//     newValue:Object;//
//     record(key: string | number, value: any): any;
//     commit(): void;
//     push():void;
// }
// class OperationsRecords implements Operations {
//     data: OperationRecord[] = [];
//     records: OperationRecord[] = [];
//     oldValue:Object={};//
//     newValue:Object={};//
//     record(key: string | number, value: any){

//     }
//     commit(){

//     }
//     push(){

//     }

// }
// const data=Immutable.fromJS({ids:123});
// const obj=Immutable.fromJS([]);
// const Map1 = Immutable.fromJS({a:111,b:222,c:{d:333,e:444}});
//  const Map2 = Immutable.fromJS({a:111,b:222,c:{e:444,f:555}}).mergeDeep(Map1);
// console.log(data,obj,Map1,Map2) 
require('./core/index.js')