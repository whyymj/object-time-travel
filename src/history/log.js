import Persistence from './logPersistence'
import Immutable from 'immutable'
class Log {
    max = 1000;
    storage = [];
    logs = [];
    keyIdx = {};
    size = 0;
    currentItem = null;
    persistence = null;
    constructor(options = {
        max:1000,
        store:null,
        storeName: 'object-snap-shot',
        strategy: 0
    }) {
        this.max = Math.max(options.max, 1);
        this.persistence = new Persistence({
            store: options ?.store,
            storeName: options ?.storeName ? options.storeName : 'object-snap-shot',
            strategy: options.strategy ?? 0
        })
   
        this.storage = this.persistence.originalValueLogs;
        this.logs = this.persistence.logs; 
        this.logs.forEach((log, idx) => {
            this.keyIdx[log.commit] = idx;
        })
    }
}
//log
Log.prototype.exportLogs = function (callback) {
    callback && callback(Immutable.fromJS(this.persistence.logs).toJS())
    return this;
}

//init
Log.prototype.init = function (max = 1000) {
    this.persistence.clear();
    this.keyIdx = {};
    this.size = 0;
    this.max = Math.max(max, 1);

}
//add del update check
Log.prototype.push = function (key, value) {
    if (this.keyIdx[key] === undefined) {
        let item = {
            key,
            value
        }
        if (this.storage.length > this.max) {
            let first = this.storage[0];
            this.remove(first.key);
        }
        this.persistence.push(key, value)
        this.size = this.storage.length;
        this.keyIdx[key] = this.storage.length - 1;
        this.currentItem = item;
        return item
    } else {
        return this.update(key, value)
    }
}
Log.prototype.remove = function (key, callback) {
    if (this.keyIdx[key] !== undefined) {
        let oldIdx = this.keyIdx[key];
        let item = this.storage[oldIdx];
        this.persistence.remove(oldIdx);
        callback && callback(item);
        delete this.keyIdx[key];
        for (let k in this.keyIdx) {
            if (this.keyIdx[k] > oldIdx) {
                this.keyIdx[k]--;
            }
        }
        this.size = this.storage.length
        if (this.currentItem === item) {
            this.currentItem = this.storage[Math.min(oldIdx, this.size - 1)];
        }
        return item;
    }
}
Log.prototype.update = function (key, value) {
    if (this.keyIdx[key] !== undefined) {
        let idx = this.keyIdx[key];
        this.persistence.update(idx, value);
        let item = this.storage[idx];
        this.currentItem = item;
        return item
    } else {
        return this.push(key, value)
    }
}
Log.prototype.search = function (key) {
    this.currentItem = this.storage[this.keyIdx[key]];
    return this.currentItem
}

export default Log;