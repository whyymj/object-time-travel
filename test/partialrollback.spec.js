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
    let key = 'commit 1'
    recorder.reset(key)
    expect(data).toEqual(cachedata[key]);

    it('only rollback id to 3', () => {
        let k = 'commit 3'
        let copy = deepcopy(cachedata[key])
        copy.id = 3
        recorder.reset(k, {
            paths: ['id']
        })
        expect(data).toEqual(copy);
    })
})


describe('test async data rollback ', () => {

    it('only rollback id to 3', () => {

        let key = 'commit 3'
        recorder.reset(key, {
            'list': (callback) => {
                setTimeout(() => {
                    callback([11, 22, 33])
                    console.log(data);
                    expect(data).toEqual({
                        ...cachedata[key],
                        list: [11, 22, 33]
                    });
                    // {
                    //     id: 3,
                    //     list: [ 11, 22, 33 ], // this field is reseted by 'cb([11, 22, 33])'
                    //     child: { name: 'child3', info: { txt: 'txt=3' } }
                    // }
                }, 1000)
            }
        });
        expect(data).toEqual(cachedata[key]);

    })
})

describe('test setPath data ', () => {
    it('set data.child.name to 3', () => { 
        recorder.setPath('child.name',0);//
        expect(data.child.name).toEqual(0);
    })
})