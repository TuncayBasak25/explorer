import fs from "fs";
import path from "path";
import { File } from '../';

import { Mixin } from "ts-mixer"
import Finder from "./finder.mixin";


export class Folder extends Mixin(Finder) {
    public static readonly instances: { [key: string]: Folder } = {};

    public constructor(public readonly path: string) {
        super();
        if (!fs.lstatSync(path).isDirectory()) {
            throw new Error("The path specified must be a folder.");
        }
        if (Folder.instances[path]) {
            return Folder.instances[path];
        }
        else {
            Folder.instances[path] = this;
        }
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
    
    // public getFolder(folderName: string): Folder | null {
    //     const index = this.folderNameList.indexOf(folderName);
    //     if (index !== -1) {
    //         return new Folder(this.pathJoin(folderName));
    //     }
        
    //     return null;
    // }

    // public getFile(fileName: string): File | null {
    //     const index = this.fileNameList.indexOf(fileName);
    //     if (index !== -1) {
    //         return new File(this.pathJoin(fileName));
    //     }
    
    //     return null;
    // }
    
    public pathJoin(name: string): string {
        return path.join(this.path, name);
    }
}