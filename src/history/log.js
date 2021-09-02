class Log {
    max = 10
    storage = []
    keyIdx = {};
    size = 0;
}
Log.prototype.init = function (max = 10) {
    this.storage = [];
    this.keyIdx = {};
    this.size = 0;
    this.max = Math.max(max, 1);
}
Log.prototype.remove = function (key) {
    if (this.keyIdx[key] !== undefined) {
        let oldIdx = this.keyIdx[key];
        this.storage.splice(oldIdx, 1);
        delete this.keyIdx[key];
        for (let k in this.keyIdx) {
            if (this.keyIdx[k] > oldIdx) {
                this.keyIdx[k]--;
            }
        }
        this.size = this.storage.length
        return true;
    }
    return false;
}
Log.prototype.update = function (key, value) {
    if (this.keyIdx[key] !== undefined) {
        this.remove(key);
        delete this.keyIdx[key];
        this.push(key, value);
        return true;
    }
    return false;
}
Log.prototype.search = function (key) {
    if (this.keyIdx[key] !== undefined) {
        return {
            ...this.storage[this.keyIdx[key]],
            index: this.keyIdx[key]
        }
    }
}
Log.prototype.push = function (key, value) {
    if (this.keyIdx[key] === undefined) {
        this.storage.push({
            timestamp: new Date().getTime(),
            key,
            value
        });
        if (this.storage.length > this.max) {
            this.remove(this.first().key)
        }
        this.size = this.storage.length
    } else {
        this.update(key, value)
    }
    this.keyIdx[key] = this.storage.length - 1;
}
Log.prototype.last = function () {
    return this.storage[this.storage.length - 1];
}
Log.prototype.first = function () {
    return this.storage[0];
}

export default Log;