import { File, Folder } from "..";
import { Query, WHERE, testAny, StringOptions } from "query";

enum Types {
    Content,
    File,
    Folder
}

type Content = Folder | File;

type ContentOptions = {
    name?: StringOptions,
}

type FolderOptions = ContentOptions & {
    fileList?: FileOptions,
    folderList?: FolderOptions,
    contentList?: ContentOptions
}

type FileOptions = ContentOptions & {
    extension?: StringOptions,
    basename?: StringOptions,
    content?: StringOptions
}

export default abstract class Finder {
    public abstract contentList: Content[];
    public abstract folderList: Folder[];
    public abstract fileList: File[];

    private getList(type: Types): Folder[] | File[] | Content[] {
        switch (type) {
            case Types.Content: return this.contentList;
            case Types.Folder: return this.folderList;
            case Types.File: return this.fileList;
        }
    }

    private find<T>(type: Types, conditions: WHERE<any>, recursive?: boolean, recursiveDepth?: number): T | null {
        for (let content of (this.getList(type) as unknown) as T[]) {
            if (testAny(content, conditions)) {
                return content;
            }
        }

        if (recursive && recursiveDepth !== 0) {
            if (typeof recursiveDepth === 'number') {
                recursiveDepth--;
            }
            for (let folder of this.folderList) {
                const result = folder.find<T>(type, conditions, recursive, recursiveDepth);

                if (result) {
                    return result;
                }
            }
        }

        return null;
    }

    private findMultiple<T>(type: Types, query: Query<any>, recursive?: boolean, recursiveDepth?: number): T[] {
        const resultList: T[] = [];

        for (let content of (this.getList(type) as unknown) as T[]) {
            if (testAny(content, query.where || {})) {
                resultList.push(content);
            }
        }

        if (recursive && recursiveDepth !== 0) {
            if (typeof recursiveDepth === 'number') {
                recursiveDepth--;
            }
            for (let folder of this.folderList) {
                const result = folder.findMultiple<T>(type, { where: query.where }, recursive, recursiveDepth);
                resultList.push(...result);
            }
        }

        if (typeof query.page === 'number' && query.limit) {
            query.offset = query.page * query.limit;
        }

        if (query.offset) {
            resultList.splice(0, query.offset);
        }

        if (query.limit) {
            resultList.splice(query.limit);
        }

        return resultList;
    }

    public findOne(conditions: WHERE<ContentOptions> = {}, recursive?: boolean, recursiveDepth?: number): Content | null {
        return this.find<Content>(Types.Content, conditions, recursive, recursiveDepth);
    }

    public findFolder(conditions: WHERE<FolderOptions> = {}, recursive?: boolean, recursiveDepth?: number): Folder | null {
        return this.find<Folder>(Types.Folder, conditions, recursive, recursiveDepth);
    }

    public findFile(conditions: WHERE<FileOptions> = {}, recursive?: boolean, recursiveDepth?: number): File | null {
        return this.find<File>(Types.File, conditions, recursive, recursiveDepth);
    }

    public findAll(query: Query<ContentOptions> = {}, recursive?: boolean, recursiveDepth?: number): Content[] {
        return this.findMultiple<Content>(Types.Content, query, recursive, recursiveDepth);
    }

    public findAllFolder(query: Query<FolderOptions> = {}, recursive?: boolean, recursiveDepth?: number): Folder[] {
        return this.findMultiple<Folder>(Types.Folder, query, recursive, recursiveDepth);
    }

    public findAllFile(query: Query<FileOptions> = {}, recursive?: boolean, recursiveDepth?: number): File[] {
        return this.findMultiple<File>(Types.File, query, recursive, recursiveDepth);
    }
}
