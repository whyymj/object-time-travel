export default class Recorder {
    currentBranch = [];
    logs = {};
    branches = {}
    tmpCache = []
    observe(data, branch) {
        if (this.branches[branch]) {
            this.currentBranch = this.branches[branch]
        } else {
            this.currentBranch = this.branches[branch] = []
        }
    }
    checkout() {

    }
    init() {

    }
    rm() {}
    commit() {

    }
    merge() {}
    log() {}
    status() {}
    diff() {}
    reset() {}
    revert() {}
}