"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_1 = __importDefault(require("./file"));
class Folder {
    constructor(path) {
        this.path = path;
    }
    get name() {
        return path_1.default.basename(this.path);
    }
    get contentNameList() {
        return fs_1.default.readdirSync(this.path);
    }
    get subfolderNameList() {
        const subfolderNameList = [];
        for (let contentName of this.contentNameList) {
            const contentPath = path_1.default.join(this.path, contentName);
            if (fs_1.default.lstatSync(contentPath).isDirectory()) {
                subfolderNameList.push(contentName);
            }
        }
        return subfolderNameList;
    }
    get fileNameList() {
        const fileNameList = [];
        for (let contentName of this.contentNameList) {
            const contentPath = path_1.default.join(this.path, contentName);
            if (fs_1.default.lstatSync(contentPath).isFile()) {
                fileNameList.push(contentName);
            }
        }
        return fileNameList;
    }
    get subfolders() {
        const subfolders = {};
        for (let folderName of this.subfolderNameList) {
            const folderPath = path_1.default.join(this.path, folderName);
            subfolders[folderName] = new Folder(folderPath);
        }
        return subfolders;
    }
    get subfolderList() {
        const subfolderList = [];
        for (let folderName of this.subfolderNameList) {
            const folderPath = path_1.default.join(this.path, folderName);
            subfolderList.push(new Folder(folderPath));
        }
        return subfolderList;
    }
    get files() {
        const files = {};
        for (let fileName of this.fileNameList) {
            const filePath = path_1.default.join(this.path, fileName);
            files[fileName] = new file_1.default(filePath);
        }
        return files;
    }
    get fileList() {
        const fileList = [];
        for (let fileName of this.fileNameList) {
            const filePath = path_1.default.join(this.path, fileName);
            fileList.push(new file_1.default(filePath));
        }
        return fileList;
    }
    getFileIncluding(expression, recursive = false) {
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
    require() {
        const mymodule = {};
        for (let file of Object.values(this.files)) {
            if (file.extension === '.js' || file.extension === '.ts') {
                const Class = file.require();
                mymodule[Class.name] = Class;
            }
        }
        for (let subfolder of Object.values(this.subfolders)) {
            const submodule = subfolder.require();
            if (Object.values(submodule).length > 0) {
                mymodule[subfolder.name] = submodule;
            }
        }
        return mymodule;
    }
}
exports.default = Folder;
