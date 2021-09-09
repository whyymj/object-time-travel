const rollback = require('../dist/index').default;
const recorder = new rollback()
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
    }); // link
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

describe('test data rollback ', () => {
    let keys = Object.keys(cachedata);
    keys.forEach((k) => {
        it(k, () => {
            recorder.reset(k)
            expect(data).toEqual(cachedata[k]);
        })
    })
    keys.reverse().forEach((k) => {
        it(k, () => {
            recorder.reset(k)
            expect(data).toEqual(cachedata[k]);
        })
    })

})

 