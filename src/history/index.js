import snapShot from 'tree-snap-shot'
import Log from './log'
import {
    isChildPath,
    isParentPath,
    sliceChildTreePath,
    createTreeByPaths,
    getCertainPathChild
} from '../util/index.js'
import EventListener from './evenListener.js'


function pipe(data) {
    if (data && typeof data != 'object') {
        throw new Error('只能绑定 typeof == “object” 普通对象或数组')
    }
    this.el = data;
    this.backup = snapShot.toImmutable(data);
    return this
}

function getTree(paths) {
    if (paths.length) {
        return createTreeByPaths(paths)
    }
}

function formatePaths(targetPaths, splitFlag = '.') {
    if (typeof splitFlag !== 'string' || splitFlag === '') {
        throw new Error('invalid split flag : "' + splitFlag + '"')
    }

    let paths = []
    if (Array.isArray(targetPaths)) {
        targetPaths.map(path => {
            if (typeof path == 'string') {
                paths.push(path.split(splitFlag))
            } else if (Array.isArray(path)) {
                paths.push(path)
            }
        })
    } else if (typeof targetPaths == 'string') {
        paths.push(targetPaths.split(splitFlag))
    }
    return paths
}

function setPath(path, value, option = {}) {
    if (typeof path == 'string') {
        path = path.split(option.splitFlag || this.splitFlag)
    }else if(!Array.isArray(path)) {
        return
    }
    if (typeof value == 'function') {
        value((val) => {
            snapShot.step(['replace', path, val], this.el)
        })
    } else {
        snapShot.step(['replace', path, value], this.el)
    }
}

function asyncReset(tree) {
    let paths = Object.keys(tree);
    if (paths.length) {
        paths.forEach(path => {
            let callback = (value) => {
                if (callback.resetId == this.resetId) {
                    snapShot.step(['replace', path.split(this.splitFlag || '.'), value], this.el)
                }
            }
            callback.resetId = this.resetId;
            if (typeof tree[path] == 'function') {
                tree[path](callback)
            } else if (Array.isArray(tree[path])) {
                tree[path].forEach(fun => {
                    if (typeof fun == 'function') {
                        fun(callback)
                    }
                })
            }
        })
    }
}

function reset(logKey, option = {
    paths: [], //[],''
    splitFlag: '.',
    ignore: [], //[],''
    async: {

    }
}) {
    if (!snapShot.deepEqual(this.backup, this.el)) {
        this.backup.clear ?.();
        this.backup = snapShot.toImmutable(this.el);
    }
    let asyncUpdate = {
        ...this.asyncUpdate,
        ...option.async,
    };
    let proto = this.logs.search(logKey);
    let targetPaths = [...formatePaths(option.paths, option.splitFlag || this.splitFlag), ...this.recordPaths];
    let ignorePaths = [...formatePaths([...Object.keys(asyncUpdate), ...(option.ignore || [])], option.splitFlag || this.splitFlag), ...this.ignorePaths];
    if (proto) {
        let log;
        snapShot.compare(this.backup, proto, {
            maxDepth: 20, //最大递归判断深度
            listItemSimiliarity: 0.7
        }).exportLog(lg => {
            log = lg;
        });

        let updateTree = getTree(targetPaths);
        let ignoreTree = getTree(ignorePaths);

        snapShot.replay(log, this.el, oper => {
            if (oper[0] == 'init' || oper[0] == 'add' || oper[0] == 'update' || oper[0] == 'del') {
                oper[1] = snapShot.union(oper[1], updateTree);
                oper[1] = snapShot.difference(oper[1], ignoreTree);
                if (oper[0] == 'init') {
                    return
                }
                for (let k in this.eventsListeners) {
                    isParentPath(this.eventsListeners[k], oper[1], result => {
                        if (result !== undefined) {
                            this.trigger(this.eventsListeners[k], result, k, oper[0])
                        }
                    })
                }
            } else if (oper[0] == 'diff') {
                if (typeof updateTree == 'object') {
                    if (!isChildPath(oper[1], updateTree) || isChildPath(oper[1], ignoreTree)) {
                        return false
                    }
                }

            } else if (oper[0] === 'replace') {
                let childTree = getCertainPathChild(oper[1], this.el);
                if (typeof childTree == 'object') {
                    let childPath;
                    for (let k in this.eventsListeners) {
                        childPath = sliceChildTreePath(this.eventsListeners[k], oper[1])
                        if (childPath) {
                            isParentPath(childPath, oper[2], result => {
                                if (result !== undefined) {
                                    this.trigger(this.eventsListeners[k], result, k, oper[0])
                                }
                            })
                        }

                    }
                }

            }
        });
        this.resetId = logKey;
        asyncReset.call(this,asyncUpdate);
    }
    return this;
}

class SnapShot {
    el = null; //当前绑定的数据引用地址
    backup = null; //备份
    logs = null; //commit记录
    listeners; //自定义事件发布订阅
    splitFlag = '.'; //路径path连接符
    recordPaths = []; //只监听的path
    recordTree = {};
    ignorePaths = []; //不监听的path
    ignoreTree = {};
    eventsListeners = {}; //事件索引
    logMaxNum = 1000; //最大log记录数，超出后旧记录出栈
    asyncUpdate = {}
    resetId = '';
    constructor(option = {
        paths: [], //['path1.path2.path3...pathn','...']
        splitFlag: '.',
        logMaxNum: 1000,
        ignore: [], //['path1.path2.path3...pathn','...']
        async: {

        },
        persistence:{
            store:null,
            storeName: null,
            strategy: 1
        }
    }) {
        this.logMaxNum = Math.max(option.logMaxNum, 1) || 1000;    
        this.logs = new Log({
            max:this.logMaxNum ,
            strategy: 1,
            ...option.persistence
        })
        this.splitFlag = option.splitFlag || '.';
        this.asyncUpdate = option.async || {};
        Object.keys(this.asyncUpdate)
        if (option.paths) {
            this.recordPaths = formatePaths(option.paths, this.splitFlag);
            this.recordTree = getTree(this.recordPaths);
        }
        if (option.ignore) {
            this.ignorePaths = formatePaths(option.ignore, this.splitFlag);
            this.ignoreTree = getTree(this.ignorePaths);
        }
        this.listeners = new EventListener();

    }
    watch(key, callback) {
        if (typeof key === 'string') {
            this.eventsListeners[key] = key.split(this.splitFlag)
            this.listeners.add(this.eventsListeners[key], callback)
        }
        return this;
    }
    removeObserver(key, callback) {
        if (typeof key === 'string' && this.eventsListeners[key]) {
            this.listeners.remove(this.eventsListeners[key], callback)
            delete this.eventsListeners[key]
        }
        return this;
    }
    trigger(key, ...arg) {
        if (Array.isArray(key)) {
            this.listeners.trigger(key, ...arg)
            return
        }
        this.listeners.trigger(this.eventsListeners[key], ...arg)
    }

    removeCommit(key) {
        this.logs.remove(key, val => {
            if (val && val.clear) {
                val.clear();
            }
        });
        return this;
    }
    commit(key) {
        if (!this.el) {
            return this
        }
        if (!snapShot.deepEqual(this.backup, this.el)) {
            this.backup.clear ?.();
            this.backup = snapShot.toImmutable(this.el);
        }
        this.logs.push(key, this.backup);
        return this
    }
    merge(key1, key2) {
        return this;

    }
    log(callback) {
        callback && this.logs.exportLogs(callback)
        return this;
    }
    diff(obj1, obj2, callback) {
        if (typeof obj1 === 'string') {
            obj1 = this.logs.search(obj1);
        }
        if (typeof obj2 === 'string') {
            obj2 = this.logs.search(obj2);
        }
        callback && snapShot.compare(obj1, obj2).getDiff(callback);
        return this;
    }

    revert() {}
}
SnapShot.prototype.reset = reset;
SnapShot.prototype.setPath = setPath;
SnapShot.prototype.pipe = pipe;

export default SnapShot;