export default class Persist {
    persist(storage, name = 'object-snap-shot') {
        if (typeof storage.setItem == 'function' && typeof storage.getItem == 'function') {
            this.persistor = storage;
            let logs = this.persistor.getItem(name);
            if (typeof logs == 'string') {
                try {
                    logs = JSON.parse(logs)
                } catch (e) {
                    logs = []
                }
            } 

        }
    }
}