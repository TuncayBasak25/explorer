import File from './file';
export default class Folder {
    readonly path: string;
    constructor(path: string);
    get name(): string;
    get contentNameList(): string[];
    get subfolderNameList(): string[];
    get fileNameList(): string[];
    get subfolders(): {
        [key: string]: Folder;
    };
    get subfolderList(): Folder[];
    get files(): {
        [key: string]: File;
    };
    get fileList(): File[];
    getFileIncluding(expression: string, recursive?: boolean): File | null;
    require(): {
        [key: string]: any;
    };
}
//# sourceMappingURL=folder.d.ts.map