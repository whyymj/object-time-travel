import snapShot from '../util/tree-snap-shot'

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
    if (this.logs[this.branch]) {
        this.currentLogs = this.logs[this.branch]
    } else {
        this.currentLogs = this.logs[this.branch] = {}
    }
    return this
}
class SnapShot {
    logIndex = 0;
    branch = 'master'
    el = null; //当前绑定的数据引用地址
    backup = null; //备份
    currentLogs = {}; //当前el的log索引
    /**
     * [branchname]:{[commit]:[logs,....]}
     */
    logs = {};

    init(branch) {
        if (typeof branch == 'string' || typeof branch == 'number') {
            this.branch = branch;
        }
        if (this.backup ?.clear) {
            this.backup.clear()
        }
        this.backup = null;
        this.el = null;
        this.currentLogs = this.logs[this.branch] = {}
        return this;
    }
    rm() {}
    commit(key) {
        if (!this.el) {
            return this
        }
        if (!snapShot.deepEqual(this.backup, this.el)) {
            this.backup.clear ?.();
            this.backup = snapShot.toImmutable(this.el);
        }
        let log = {
            index: this.logIndex,
            timestamp: new Date().getTime(),
            value: this.backup
        }
        this.currentLogs[key] = log;
        this.logIndex++
        return this
    }
    merge() {}
    log(branch) {

    }
    status() {}
    diff() {}
    reset(logKey, branch) {
        let proto = this.logs[branch === undefined ? this.branch : branch] ?. [logKey];

        if (proto) {
            let log;
            snapShot.compare(this.backup, proto.value).exportLog(lg => {
                log = lg;
            }).replay(log, this.el)
        }
    }
    revert() {}
}
SnapShot.prototype.pipe = pipe;
export default SnapShot;