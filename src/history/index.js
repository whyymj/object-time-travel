import snapShot from 'tree-snap-shot'
import Log from './log'
import {
    isChildPath
} from '../util/index.js'


function pipe(data) {
    if (data && typeof data != 'object') {
        throw new Error('只能绑定 typeof == “object” 普通对象或数组')
    }
    this.el = data;
    this.backup = snapShot.toImmutable(data);
    if (this.allLogs[this.branch]) {
        this.curBranchLogs = this.allLogs[this.branch]
    } else {
        this.curBranchLogs = this.allLogs[this.branch] = new Log()
    }
    return this
}

function getTreeByPaths(paths) {
    let tree = {}
    paths.map((path) => {
        let child = tree;
        let p;
        for (let i = 0; i < path.length; i++) {
            p = path[i];
            if (child === null) {
                break;
            }
            if (child && i === path.length - 1) {
                child[p] = null
            } else if (child[p] === undefined) {
                child = child[p] = {}
            } else if (child && typeof child == 'object') {
                child = child[p]
            }
        }
    })

    return tree
}

function getTree(paths) {
    if (paths.length) {
        return getTreeByPaths(paths)
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
    }
    return paths
}

class SnapShot {
    branch = 'master'
    el = null; //当前绑定的数据引用地址
    backup = null; //备份
    curBranchLogs = null;
    allLogs = {};

    initBranch(branch, logMaxNum = 100) { //默认存储100条
        if (typeof branch == 'string' || typeof branch == 'number') {
            this.branch = branch;
        }
        if (this.allLogs[this.branch]) {
            this.allLogs[this.branch].init(logMaxNum);
        }
        return this;
    }
    checkout(branch) {
        if (typeof branch == 'string' || typeof branch == 'number') {
            this.branch = branch;
        }
        if (this.allLogs[this.branch]) {
            this.curBranchLogs = this.allLogs[this.branch]
        } else {
            this.curBranchLogs = this.allLogs[this.branch] = new Log()
        }
        return this;
    }
    delBranch() {
        if (this.allLogs[this.branch]) {
            this.allLogs[this.branch].initBranch();
            delete this.allLogs[this.branch]
        }
    }
    rm(key) {
        this.curBranchLogs.remove(key, val => {
            if (val.value && val.value.clear) {
                val.value.clear();
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
        this.curBranchLogs.push(key, this.backup);
        return this
    }
    merge(key1, key2) {
        return this;

    }
    log(branch, callback) {
        return this;
    }
    status() {
        return this;
    }
    diff(obj1, obj2) {
        return this;
    }
    reset(logKey, option = {
        paths: [], //[],''
        splitFlag: '.',
        ignore: [], //[],''
    }) {
        let branchLog = this.allLogs[this.branch];
        let proto = branchLog && branchLog.search(logKey);
        let targetPaths=formatePaths(option.paths, option.splitFlag);
        let ignorePaths=formatePaths(option.ignore, option.splitFlag);
        if (proto) {
            let log;
            snapShot.compare(this.backup, proto.value).exportLog(lg => {
                log = lg;
            });

            let updateTree = getTree(targetPaths);
            let ignoreTree = getTree(ignorePaths);

            snapShot.replay(log, this.el, oper => {
                if (oper[0] == 'init' || oper[0] == 'add' || oper[0] == 'update' || oper[0] == 'del') {
                    oper[1] = snapShot.union(oper[1], updateTree)
                    oper[1] = snapShot.difference(oper[1], ignoreTree)
                } else if (oper[0] == 'diff') {
                    if (!isChildPath(oper[1], updateTree) || isChildPath(oper[1], ignoreTree)) {
                        return false
                    }
                }
            });
        }
        return this;
    }
    revert() {}
}
SnapShot.prototype.pipe = pipe;

export default SnapShot;