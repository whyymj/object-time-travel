import {
    createTreeByPaths,
    getCertainPathChild
} from '../util/index.js'
let Symbol = global.Symbol;
let idCounter = 0;

if (!Symbol) {
    Symbol = function Symbol(key) {
        return `__${key}_${Math.floor(Math.random() * 1e9)}_${++idCounter}__`
    }

    Symbol.iterator = Symbol('Symbol.iterator')
}

global.Symbol = Symbol;

const flag = 'flag' || Symbol('listeners');
/**
 * 挂载
 */
function hang(path, tree = {}, value) {

    let child = tree;
    let p;
    for (let i = 0; i < path.length; i++) {
        p = path[i];

        if (child[p] === undefined) {
            child = child[p] = {

            }
        } else if (child && typeof child == 'object') {
            child = child[p]
        }
    }
    child[flag] = child[flag] || []
    child[flag].push(value)
    return child
}

/**
 * 查找
 */
function pick(path, tree, del) {
    let childTree = getCertainPathChild(path, tree)
    let fruits = [] 
    function traverse(tree) {
        if (typeof tree !== 'object') {
            return
        }
        if (tree[flag]) {
            if (del) {
                tree[flag] = tree[flag].filter(item => {
                    return item !== del;
                })
            } else {
                fruits.push(...tree[flag])
            }
        }
        for (let k in tree) {
            if (typeof tree[k] == 'object') {
                if (k === flag) {
                    if (tree[k][flag]) {
                        if (del) {
                            tree[k][flag] = tree[k][flag].filter(item => {
                                return item !== del;
                            })
                        } else {
                            fruits.push(...tree[k][flag])
                        }
                    }
                } else {
                    traverse(tree[k])
                }
            }
        }

    }
    traverse(childTree)
    return fruits
}

export default class EventListener {
    cacheListener = {}

    add(key, listener) {
        if (!Array.isArray(key)) {
            throw new Error('need array')
        }
        if (typeof listener == 'function') {
            hang(key, this.cacheListener, listener)
        }
        return this
    }
    remove(key, listener) {
        pick(key, this.cacheListener, listener)
        return this;
    }
    trigger(key, ...value) { 
        pick(key, this.cacheListener).forEach(fun=>{
            fun(...value)
        })
        return this;
    }
}