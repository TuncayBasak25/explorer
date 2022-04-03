declare type Listener = (args: {
    subject: any;
    filename: string;
}) => void;
export default abstract class Watcher {
    abstract readonly path: string;
    private listenerList;
    private watcher?;
    watch(listener: Listener): void;
    removeListener(listener: Listener): void;
    removeAllListeners(): void;
    private setWatcher;
}
export {};
//# sourceMappingURL=watcher.mixin.d.ts.map