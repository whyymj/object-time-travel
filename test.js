function isChildPath(curPath, ignorePath) {
    if (curPath.length < ignorePath.length) {
        return false
    }
    for (let i = ignorePath.length-1; i > 0; i--) {
        if (ignorePath[i] != curPath[i]) {
            return false
        }
    }
    return true;
}


console.log('isChildPath',isChildPath([1,2,3,5],[1,2,3]))

// recorder.pipe(data);// link

// //start changing
// for (let i = 0; i < 10; i++) {
//     data.id = i;
//     data.list.push(i);
//     data.child.name = 'child' + i;
//     data.say = function () {
//         console.log(i, 'oooooo')
//     }
//     recorder.commit('commit '+ i);// record snap shot
// }

// //rollback test
// setTimeout(function () {
//     recorder.reset('commit '+ 3);
//     data.say();// 3 oooooo
//     console.log(list);// { name: 'child3' }
//     console.log(data);//{ id: 3, list: [ 0, 1, 2, 3 ], child: { name: 'child3' }, say: [Function (anonymous)] }
// }, 500)