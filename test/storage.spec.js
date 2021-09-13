import {
    testLogs
} from '../src/test/storage'
const testCache = {}
const store = {
    setItem(key, val) {
        testCache[key] = val;
    },
    getItem(key) {
        return testCache[key]
    }
}

const rollback = require('../dist/index.js').default;
const recorder = new rollback({
    persistence: {
        store,
        storeName: 'test-store',

    }
});

let data = {
    id: 1,
    list: [],
}
let commitKey = ''
recorder.pipe(data)
describe('test persistence ', () => {

    for (let i = 0; i < 10; i++) {
        data.id = i;
        data.list.push(i);
        commitKey = 'commit ' + i;
        recorder.commit(commitKey); // record snap shot
    }
    it('test storage', () => {
        expect(testCache).toEqual({
            "test-store": [{
                "commit": "commit 0",
                "value": {
                    "id": 0,
                    "list": [0]
                },
                "strategy": 0
            }, {
                "commit": "commit 1",
                "value": [
                    ["update", {
                        "id": 1
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 1, 1]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 2",
                "value": [
                    ["update", {
                        "id": 2
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 2, 2]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 3",
                "value": [
                    ["update", {
                        "id": 3
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 3, 3]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 4",
                "value": [
                    ["update", {
                        "id": 4
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 4, 4]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 5",
                "value": [
                    ["update", {
                        "id": 5
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 5, 5]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 6",
                "value": [
                    ["update", {
                        "id": 6
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 6, 6]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 7",
                "value": [
                    ["update", {
                        "id": 7
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 7, 7]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 8",
                "value": [
                    ["update", {
                        "id": 8
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 8, 8]
                        ]
                    ]
                ],
                "strategy": 1
            }, {
                "commit": "commit 9",
                "value": [
                    ["update", {
                        "id": 9
                    }],
                    ["diff", ["list"],
                        [
                            ["add", 9, 9]
                        ]
                    ]
                ],
                "strategy": 1
            }]
        })
    })

})