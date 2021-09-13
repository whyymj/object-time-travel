const rollback = require('./dist/index.js').default;
const recorder = new rollback()
const snapShot = require('tree-snap-shot')
const deepcopy = require('deepcopy')
const deepis = require('deep-is')
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
                console.log(data);//{ id: 3, child: { name: 'child3', info: { txt: 'txt=3' } },  list: [ 11, 22, 33 ] }
            },1000)
        }
    }
})

console.log(data);//{ id: 3, child: { name: 'child3', info: { txt: 'txt=3' } } }