import fs from "fs";
import path from "path";
import File from './file';

export default class Folder {
    public constructor(public readonly path: string) { }

    public get name(): string {
        return path.basename(this.path);
    }

    public get contentNameList(): string[] {
        return fs.readdirSync(this.path);
    }

    public get subfolderNameList(): string[] {
        const subfolderNameList = [];

        for (let contentName of this.contentNameList) {
            const contentPath = path.join(this.path, contentName);

            if (fs.lstatSync(contentPath).isDirectory()) {
                subfolderNameList.push(contentName);
            }
        }

        return subfolderNameList;
    }

    public get fileNameList(): string[] {
        const fileNameList = [];

        for (let contentName of this.contentNameList) {
            const contentPath = path.join(this.path, contentName);

            if (fs.lstatSync(contentPath).isFile()) {
                fileNameList.push(contentName);
            }
        }

        return fileNameList;
    }

    public get subfolders(): { [key: string]: Folder } {
        const subfolders: { [key: string]: Folder } = {};

        for (let folderName of this.subfolderNameList) {
            const folderPath = path.join(this.path, folderName);

            subfolders[folderName] = new Folder(folderPath);
        }

        return subfolders;
    }

    public get subfolderList(): Folder[] {
        const subfolderList: Folder[] = [];

        for (let folderName of this.subfolderNameList) {
            const folderPath = path.join(this.path, folderName);

            subfolderList.push(new Folder(folderPath));
        }

        return subfolderList;
    }

    public get files(): { [key: string]: File } {
        const files: { [key: string]: File } = {};

        for (let fileName of this.fileNameList) {
            const filePath = path.join(this.path, fileName);

            files[fileName] = new File(filePath);
        }

        return files;
    }

    public get fileList(): File[] {
        const fileList: File[] = [];

        for (let fileName of this.fileNameList) {
            const filePath = path.join(this.path, fileName);

            fileList.push(new File(filePath));
        }

        return fileList;
    }

    public getFileIncluding(expression: string, recursive: boolean = false): File | null {
        for (let file of this.fileList) {
            if (file.name.indexOf(expression) !== -1) {
                return file;
            }
        }

        if (recursive) {
            for (let subfolder of this.subfolderList) {
                const file = subfolder.getFileIncluding(expression, true);

                if (file) {
                    return file;
                }
            }
        }

        return null;
    }

    public require(): { [key: string]: any } {
        const mymodule: { [key: string]: any } = {}

        for (let file of Object.values(this.files)) {
            if (file.extension === '.js' || file.extension === '.ts') {
                const Class = file.require();

                mymodule[Class.name] = Class;
            }
        }

        for (let subfolder of Object.values(this.subfolders)) {
            const submodule: { [key: string]: any } = subfolder.require();

            if (Object.values(submodule).length > 0) {
                mymodule[subfolder.name] = submodule;
            }
        }

        return mymodule;
    }

}