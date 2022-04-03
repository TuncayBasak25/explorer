import { File, Folder } from "..";
import { Query, WHERE, StringOptions } from "query";
declare type Content = Folder | File;
declare type ContentOptions = {
    name?: StringOptions;
};
declare type FolderOptions = ContentOptions & {
    fileList?: FileOptions;
    folderList?: FolderOptions;
    contentList?: ContentOptions;
};
declare type FileOptions = ContentOptions & {
    extension?: StringOptions;
    basename?: StringOptions;
    content?: StringOptions;
};
export default abstract class Finder {
    abstract contentList: Content[];
    abstract folderList: Folder[];
    abstract fileList: File[];
    private getList;
    private find;
    private findMultiple;
    findOne(conditions?: WHERE<ContentOptions>, recursive?: boolean, recursiveDepth?: number): Content | null;
    findFolder(conditions?: WHERE<FolderOptions>, recursive?: boolean, recursiveDepth?: number): Folder | null;
    findFile(conditions?: WHERE<FileOptions>, recursive?: boolean, recursiveDepth?: number): File | null;
    findAll(query?: Query<ContentOptions>, recursive?: boolean, recursiveDepth?: number): Content[];
    findAllFolder(query?: Query<FolderOptions>, recursive?: boolean, recursiveDepth?: number): Folder[];
    findAllFile(query?: Query<FileOptions>, recursive?: boolean, recursiveDepth?: number): File[];
}
export {};
//# sourceMappingURL=finder.mixin.d.ts.map