import Immutable from 'immutable'
import snapShot from 'tree-snap-shot'
class Init {
    storeName = 'object-snap-shot';
    persistor = null;
    originalValueLogs = []; //原始值
    logs = []; //转化后的log 
    strategy = 1; //0：保存完整复制的值；1：基于上一个记录的相对差；2：对比首次的差值；
    constructor(option) {
        this.setOption(option)
    }
    init(logs) {
        this.logs.length=0;
        this.originalValueLogs.length=0;
        logs.forEach((log, idx) => {
            
            if (log.strategy == 0) {
                log.value = Immutable.fromJS(log.value)
                this.originalValueLogs.push(log.value)
                this.logs.push(log)
            } else {
                log.value = log.value.map(item => {
                    return Immutable.fromJS(item)
                })
                this.logs.push(log)
                let copy = log.strategy == 1 ? this.originalValueLogs[idx - 1] : this.originalValueLogs[0];
                if (Immutable.isImmutable(copy)) {
                    copy = copy.toJS()
                } else {
                    copy = Immutable.fromJS(copy).toJS();
                }
                snapShot.replay(log.value, copy);
                this.originalValueLogs.push(Immutable.fromJS(copy))
            }
        })
        console.log(Immutable.fromJS(this.logs).toJS(),'<<<<<<<<<<<< persistor')
        return this
    }
    setOption(option) {
        if (typeof option.storeName == 'string') {
            this.storeName = option.storeName || 'object-snap-shot';
        }
        console.log(option,'<<<<<<<<<<<< option')
        if (option.store) {
            this.setPersistor(option.store)
        }
        if (typeof option.strategy=='number'||typeof option.strategy=='string') {
            this.strategy=option.strategy
        }
    }
    setPersistor(storage) {
        if (typeof storage.setItem == 'function' && typeof storage.getItem == 'function') {
            this.persistor = storage;
            let logs = this.persistor.getItem(this.storeName) || [];
            if (typeof logs == 'string') {
                try {
                    logs = JSON.parse(logs)
                } catch (e) {
                    this.logs.length=0
                }
            }
            if (Array.isArray(logs)) {
                this.init(logs);
            }
        } else {
            throw new Error('Persistence needs function setItem and getItem')
        }
    }
}

export default class Persistence extends Init {
    transform(log, idx) {
        if (Immutable.isImmutable(log)) {
            log = log.toJS()
        }
        
        if (log.strategy == 0) { //0：保存完整复制的值；
            this.logs.push(log)
        } else { //1：基于上一个记录的相对差；
            let last = log.strategy == 1 ? this.originalValueLogs[idx - 1] : this.originalValueLogs[0];
            snapShot.compare(last, log.value).getDiff(df => {
                log.value = df
                this.logs[idx] = log
            })
        }
        if (this.persistor) {
            this.persistor.setItem(this.name, this.logs.map(item=>{
                if(Immutable.isImmutable(item.value)){
                    return {
                        ...item,
                        value:item.value.toJS()
                    }
                }
                return item
            }))
        }
    }
    /**
     * 
     * @param {*} commit 
     * @param {*} value 
     * @param {保存策略} strategy  //0：保存完整复制的值；1：基于上一个记录的相对差；2：对比首次的差值；
     */
    push(commit, value, strategy) {
        let log = {
            commit,
            value,
            strategy: strategy || this.strategy
        }
        this.originalValueLogs.push(value);
        if (!this.logs.length) {
            log.strategy = 0
        }
        this.transform(log, this.originalValueLogs.length - 1);
    }
    remove(idx) {
        this.originalValueLogs.splice(idx, 1);
        this.logs.splice(idx, 1);
        if (this.logs[idx] && this.logs[idx].strategy == 1) {
            this.transform(this.logs[idx], idx);
        }
    }
    update(idx, value) {
        this.logs[idx].value = value;
        if (this.logs[idx].strategy == 1) {
            this.transform(this.logs[idx], idx);
        }
    }
    clear() {
        this.logs.length=0
        this.originalValueLogs.length=0
        if (this.persistor) {
            this.persistor.setItem(this.name, [])
        }
    }
}