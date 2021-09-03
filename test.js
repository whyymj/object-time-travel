const snapShot = require('tree-snap-shot')



function traverse(newData, oldData, paths) {
    let newChild = newData;
    let oldChild = oldData;
    let val;
    for (let i = 0; i < paths.length; i++) {
        val = paths[i];
        if (i < (paths.length - 1)) {
            if (typeof newChild == 'object') {
                newChild = newChild[val]
            } else {
                break;
            }

        } else {
            delete newChild[val]
        }
    }
}

// const recorder = new rollback()
let data = () => ({
    id: 0,
    list: [0, 1, 2],
    child: {
        name: 'child',
    }
});
// let list = data.child;//

let data1 = data();


traverse(data1, ['id'])
console.log('>>>>>', data1)

data1 = data();
traverse(data1, ['list', '0'])
console.log('>>>>>', data1)


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