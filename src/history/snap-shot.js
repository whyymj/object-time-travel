import snapShot from 'tree-snap-shot'
export function diff(data1, data2) {
    let diff = [];
    snapShot.compare(data1, data2).exportLog(log => {
        diff = log;
    })
    return diff;
}