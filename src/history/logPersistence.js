
import Immutable from 'immutable'
import snapShot from 'tree-snap-shot'
// this
export default class Persist {
    tmpCache = []; //原始值
    logNum = 0;
    logs = []; //转化后的log
    persistor = null;
    strategy = 0; //0：保存完整复制的值；1：基于上一个记录的相对差；2：对比首次的差值；
    storeName = 'object-snap-shot'
    constructor(option){
        this.setOption(option)
    }
    setOption(option) {
        if (typeof option.storeName == 'string') {
            this.storeName = option.storeName || 'object-snap-shot';
        }
        if(option.store){
            this.setPersistor(option.store)
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
                    this.logs = []
                }
            }
            if (Array.isArray(logs)) {
                this.init(logs);
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
        } else { //1：基于上一个记录的相对差；
            let last = log.strategy == 1 ? this.tmpCache[idx - 1] : this.tmpCache[0];
            snapShot.compare(last, log.value).getDiff(df => {
                log.value = df
                this.logs.push(log)
            })
        }
    }
    init(logs) {
        this.logs = []
        this.tmpCache = []
        logs.forEach((log, idx) => {
            
            if (log.strategy == 0) {
                log.value=Immutable.fromJS(log.value)
                this.tmpCache.push(log.value)
                this.logs.push(log)
            } else {
                log.value=log.value.map(item=>{
                    return Immutable.fromJS(item)
                })
                this.logs.push(log)
                let copy = log.strategy == 1 ? this.tmpCache[idx - 1] : this.tmpCache[0];
                if (Immutable.isImmutable(copy)) {
                    copy = copy.toJS()
                } else {
                    copy = Immutable.fromJS(copy).toJS();
                }
                snapShot.replay(log.value, copy);
                this.tmpCache.push(Immutable.fromJS(copy))
            }
        })
        return this
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
        this.logs = []
        this.tmpCache = []
    }
}
