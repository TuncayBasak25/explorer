"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Watcher {
    constructor() {
        this.listenerList = [];
    }
    watch(listener) {
        if (!this.watcher) {
            this.setWatcher();
        }
        this.listenerList.push(listener);
    }
    removeListener(listener) {
        const index = this.listenerList.indexOf(listener);
        if (index > -1) {
            this.listenerList.splice(index, 1);
        }
    }
    removeAllListeners() {
        this.listenerList = [];
    }
    setWatcher() {
        let flag = true;
        this.watcher = (0, fs_1.watch)(this.path, (eventType, filename) => {
            if (flag) {
                flag = false;
                setTimeout(() => {
                    for (let listener of this.listenerList) {
                        listener(eventType, filename);
                    }
                    flag = true;
                }, 30);
            }
        });
    }
}
exports.default = Watcher;
