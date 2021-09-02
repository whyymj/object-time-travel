import snapShot from 'tree-snap-shot'
import Log from './log'

function pipe(data, branch = 'master') {
    if (data && typeof data != 'object') {
        throw new Error('只能绑定 typeof == “object” 普通对象或数组')
    }
    if (branch && (typeof branch == 'string' || typeof branch == 'number')) {
        this.branch = branch
    } else {
        throw new Error('branchId类型只能是(string/number)')
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

class SnapShot {
    branch = 'master'
    el = null; //当前绑定的数据引用地址
    backup = null; //备份
    curBranchLogs = null;
    allLogs = {};

    init(branch, logMaxNum = 100) {//默认存储100条
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
    rm(key) {
        this.curBranchLogs.remove(key,val=>{
            if(val.value&&val.value.clear){
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
    merge() {}
    log(branch, callback) {
        return this;
    }
    status() {}
    diff(obj1, obj2) {
        return this;
    }
    reset(logKey, branch) {
        let branchLog = this.allLogs[branch === undefined ? this.branch : branch];
        let proto = branchLog && branchLog.search(logKey);
        if (proto) {
            let log;
            snapShot.compare(this.backup, proto.value).exportLog(lg => {
                log = lg;
            }).replay(log, this.el);
        }
        return this;
    }
    revert() {}
}
SnapShot.prototype.pipe = pipe;
export default SnapShot;