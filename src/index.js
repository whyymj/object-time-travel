import snapShot from './history/index'

/**
 * 全局挂载
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DataTimeLine = {}));
}(this, (function (exports) {
    var DataTimeLine = snapShot
    exports.default = DataTimeLine; 
})))