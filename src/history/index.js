import snapShot from 'tree-snap-shot'
import Log from './log'


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
function traverse(tree, callback, path) {
    if (!path) {
        path = snapShot.toImmutable([])
    }
    for (var key in tree) {
        if (typeof tree[key] == 'object' && !Array.isArray(tree[key])) {
            if (!tree[key]) {
                callback(path.push(key))
                continue;
            }
            traverse(tree[key], callback, path.push(key))
        } else {
            if (Array.isArray(tree[key])) {
                tree[key].forEach(item => {
                    return callback(path.push(key).push(item))
                })
            } else {
                callback(path.push(key).push(tree[key]))
            }
        }
    }
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
        keys: [],
    }) {
        let branchLog = this.allLogs[this.branch];
        let proto = branchLog && branchLog.search(logKey);

        if (proto) {
            let log;
            snapShot.compare(this.backup, proto.value).exportLog(lg => {
                log = lg;
            }).replay(log, this.el,oper=>{
                console.log(oper,'?????')
            });
        }
        return this;
    }
    revert() {}
}
SnapShot.prototype.pipe = pipe;

export default SnapShot;