const objectDiff = require('./objectDiff.js').objectDiffHandler;
const arrayDiff = require('./arrayDiff.js').myersDiffHandler;
const Immutable = require("immutable");
const isObject = require("isobject");

function diff(data1, data2, path, type, resultObj, parents, handler) {
    if (Array.isArray(data1) && Array.isArray(data2)) {
        arrayDiff(data1, data2, path, type, resultObj, parents, handler);
    } else if (isObject(data1) && isObject(data2)) {
        console.log(data1, data2);
        objectDiff(data1, data1, path, type, resultObj , parents, handler);
    } 

}
exports.diff = function(data1, data2,path=[]){
    let result = [];
    diff(data1, data2, Immutable.List([]), Immutable.List([]), result, (path.length ? Immutable.List(path) : null), diff)
    
    return Immutable.fromJS(result).toJS();
}