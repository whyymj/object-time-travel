const rollback = require('./dist/index.js').default;
const recorder = new rollback()
const snapShot = require('tree-snap-shot')
const deepcopy = require('deepcopy')
const deepis = require('deep-is')
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
let cachedata = {}
recorder.pipe(data)
.watch('id', (value) => {
    console.log('id=', value)
}).watch('child.info.txt', (value) => {
    console.log('child.info.txt=', value)
}).removeObserver('id') ; // link
//start changing
let commitKey = ''
for (let i = 0; i < 10; i++) {
    data.id = i;
    data.list.push(i);
    data.child.name = 'child' + i;
    data.child.info.txt = 'txt=' + i;
    commitKey = 'commit ' + i;
    recorder.commit(commitKey); // record snap shot
    cachedata[commitKey] = deepcopy(data)
}

commitKey = 'clear child';
data.child = []
cachedata[commitKey] = deepcopy(data)
recorder.commit(commitKey); // record snap shot

commitKey = 'clear all';
delete data.id;
delete data.list;
delete data.child;
cachedata[commitKey] = deepcopy(data)
recorder.commit(commitKey); // record snap shot


for (let k in cachedata) {
    recorder.reset(k)
    deepis(data, cachedata[k]) || console.log(k, '>>>>', data, '===', cachedata[k])

    console.log('==== ********************** =====')
    console.log('')
}

console.log('==== ************ commit 1 ********** =====')
let key = 'commit 1'
recorder.reset(key)

console.log(data)

console.log()
console.log('==== ************ commit 3 ********** =====')
let k = 'commit 3'

recorder.reset(k, {
    paths: ['id']
})
console.log(data)