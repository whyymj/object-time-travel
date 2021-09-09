const Immutable = require('immutable')
const snapShot = require('tree-snap-shot')

class Storage {
    storage = {

    }
    setItem(key, val) {
        console.log(key, '===', JSON.stringify(val))
        this.storage[key] = val;
    }
    getItem(key) {
        return this.storage[key] || '';
    }
}


class Persist {
    tmpCache = []; //原始值
    logNum = 0;
    logs = []; //转化后的log
    persistor = null;
    strategy = 0; //0：保存完整复制的值；1：基于上一个记录的相对差；2：对比首次的差值；
    storeName = 'object-snap-shot'
    setOption(option) {
        if (typeof option.storeName == 'string') {
            this.storeName = option.storeName || 'object-snap-shot';
        }
    }
    setPersistor(storage) {
        if (typeof storage.setItem == 'function' && typeof storage.getItem == 'function') {
            this.persistor = storage;
            let logs = this.persistor.getItem(this.name) || [];
            if (typeof logs == 'string') {
                try {
                    logs = JSON.parse(logs)
                } catch (e) {
                    this.logs = []
                }
            }
            if (Array.isArray(logs)) {
                this.logs = logs
            }

        } else {
            throw new Error('Persistence needs function setItem and getItem')
        }
    }
    transform(log, idx) {
        if (Immutable.isImmutable(log)) {
            log = log.toJS()
        }
        if (log.strategy == 0) { //0：保存完整复制的值；
            this.logs.push(log)
        } else if (log.strategy == 1) { //1：基于上一个记录的相对差；
            let last = this.tmpCache[idx - 1];
            snapShot.compare(last, log.value).getDiff(df => {
                this.logs.push(df)
            })
        } else if (log.strategy == 2) { //2：对比首次的差值；
            let last = this.tmpCache[0];
            snapShot.compare(last, log.value).getDiff(df => {
                this.logs.push(df)
            })
        }
    }
    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @param {保存策略} strategy 
     */
    input(key, value, strategy) {
        let log = {
            key,
            value,
            strategy: strategy || this.strategy
        }
        this.tmpCache.push(value);

        if (this.logs.length == 0) {
            log.strategy = 0
        }
        this.transform(log, this.tmpCache.length - 1);
        this.persistor.setItem(this.name, this.logs)
    }
    clear() {

    }
}
let persist = new Persist();
let store = new Storage();
persist.setPersistor(store);
let list = []
for (let i = 0; i < 10; i++) {

    list.push(i)
    persist.input(i, {
        i: [...list]
    }, 2)
}

// this
[{
        "key": 0,
        "value": {
            "i": [0]
        },
        "strategy": 0
    },
    [
        ["diff", ["i"],
            [
                ["add", 1, 1]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2, 3]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2, 3, 4]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2, 3, 4, 5]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2, 3, 4, 5, 6]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2, 3, 4, 5, 6, 7]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2, 3, 4, 5, 6, 7, 8]
            ]
        ]
    ],
    [
        ["diff", ["i"],
            [
                ["add", 1, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ]
        ]
    ]
]