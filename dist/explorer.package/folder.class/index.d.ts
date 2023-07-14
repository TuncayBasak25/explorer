import { File } from '../';
import Finder from "./finder.mixin";
import Watcher from "../watcher.mixin";
declare const Folder_base: import("ts-mixer/dist/types/types").Class<any[], Finder & Watcher, typeof Finder & typeof Watcher, false>;
export declare class Folder extends Folder_base {
    readonly path: string;
    constructor(path: string);
    createFile(name: string): File;
    createFolder(name: string): Folder;
    delete(): void;
    get name(): string;
    get contentNameList(): string[];
    get folderNameList(): string[];
    get fileNameList(): string[];
    get contentList(): (Folder | File)[];
    get folderList(): Folder[];
    get fileList(): File[];
    get contents(): {
        [key: string]: File | Folder;
    };
    get folders(): {
        [key: string]: Folder;
    };
    get files(): {
        [key: string]: File;
    };
    require(): any;
    pathJoin(name: string): string;
}
export {};
//# sourceMappingURL=index.d.ts.map