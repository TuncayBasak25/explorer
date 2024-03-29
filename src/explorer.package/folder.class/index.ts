import fs from "fs";
import path from "path";
import { File } from '../';

import { Mixin } from "ts-mixer"
import Finder from "./finder.mixin";
import Watcher from "../watcher.mixin";


export class Folder extends Mixin(Finder, Watcher) {

    public constructor(public readonly path: string) {
        super();
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    public createFile(name: string): File {
        return new File(this.pathJoin(name));
    }

    public createFolder(name: string): Folder {
        return new Folder(this.pathJoin(name));
    }

    public delete(): void {
        fs.rmSync(this.path, { recursive: true, force: true });
    }

    public get name(): string {
        return path.basename(this.path);
    }

    public get contentNameList(): string[] {
        return fs.readdirSync(this.path);
    }

    public get folderNameList(): string[] {
        const folderNameList = [];

        for (let contentName of this.contentNameList) {
            if (fs.lstatSync(this.pathJoin(contentName)).isDirectory()) {
                folderNameList.push(contentName);
            }
        }

        return folderNameList;
    }

    public get fileNameList(): string[] {
        const fileNameList = [];

        for (let contentName of this.contentNameList) {
            if (fs.lstatSync(this.pathJoin(contentName)).isFile()) {
                fileNameList.push(contentName);
            }
        }

        return fileNameList;
    }

    public get contentList(): (Folder | File)[] {
        return [...this.folderList, ...this.fileList];
    }

    public get folderList(): Folder[] {
        const folderList: Folder[] = [];

        for (let folderName of this.folderNameList) {
            folderList.push(new Folder(this.pathJoin(folderName)));
        }

        return folderList;
    }

    public get fileList(): File[] {
        const fileList: File[] = [];

        for (let fileName of this.fileNameList) {
            fileList.push(new File(this.pathJoin(fileName)));
        };

        return fileList;
    }

    public get contents(): {[key: string]: File | Folder} {
        return {...this.folders, ...this.files};
    }

    public get folders(): {[key: string]: Folder} {
        const folders: {[key: string]: Folder} = {};

        for (let folderName of this.folderNameList) {
            folders[folderName] = new Folder(this.pathJoin(folderName));
        }

        return folders;
    }

    public get files(): {[key: string]: File} {
        const files: {[key: string]: File} = {};

        for (let fileName of this.fileNameList) {
            files[fileName] = new File(this.pathJoin(fileName));
        }

        return files;
    }
    
    public require(): any {
        if (this.fileNameList.includes("index.js")) {
            return new File(this.pathJoin("index.js")).require();
        }

        throw new Error("This folder cannot be required!");
    }
    
    public pathJoin(name: string): string {
        return path.join(this.path, name);
    }
}