class Recorder {
    recordes = [];
    addRecord(id, value) {
        this.recordes.push({
            timestamp: new Date().getTime(),
            data: value,
        })
    }

}