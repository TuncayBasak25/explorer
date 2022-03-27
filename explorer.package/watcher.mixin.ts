import { FSWatcher, watch } from "fs";

type Listener = (eventType: string, filename: string) => void;

export default abstract class Watcher {
    public abstract readonly path: string;

    private listenerList: Listener[] = [];
    private watcher?: FSWatcher;

    public watch(listener: Listener): void {
        if (!this.watcher) {
            this.setWatcher();
        }

        this.listenerList.push(listener);
    }

    public removeListener(listener: Listener): void {
        const index = this.listenerList.indexOf(listener);

        if (index > -1) {
            this.listenerList.splice(index, 1);
        }
    }

    public removeAllListeners(): void {
        this.listenerList = [];
    }

    private setWatcher(): void {
        let flag = true;
        this.watcher = watch(this.path, (eventType, filename) => {
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