import { Folder } from "../folder.class";
import Watcher from "../watcher.mixin";
declare const File_base: import("ts-mixer/dist/types/types").Class<any[], Watcher, typeof Watcher, false>;
export declare class File extends File_base {
    readonly path: string;
    private $content;
    constructor(path: string);
    require(): any;
    delete(): void;
    get folder(): Folder;
    private updateContent;
    get content(): string;
    set content(newContent: string);
    get name(): string;
    get basename(): string;
    get extension(): string;
}
export {};
//# sourceMappingURL=index.d.ts.map