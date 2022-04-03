"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const __1 = require("../");
const ts_mixer_1 = require("ts-mixer");
const finder_mixin_1 = __importDefault(require("./finder.mixin"));
const watcher_mixin_1 = __importDefault(require("../watcher.mixin"));
class Folder extends (0, ts_mixer_1.Mixin)(finder_mixin_1.default, watcher_mixin_1.default) {
    constructor(path) {
        super();
        this.path = path;
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.mkdirSync(path);
        }
    }
    createFile(name) {
        return new __1.File(this.pathJoin(name));
    }
    createFolder(name) {
        return new Folder(this.pathJoin(name));
    }
    delete() {
        fs_1.default.rmSync(this.path, { recursive: true, force: true });
    }
    get name() {
        return path_1.default.basename(this.path);
    }
    get contentNameList() {
        return fs_1.default.readdirSync(this.path);
    }
    get folderNameList() {
        const folderNameList = [];
        for (let contentName of this.contentNameList) {
            if (fs_1.default.lstatSync(this.pathJoin(contentName)).isDirectory()) {
                folderNameList.push(contentName);
            }
        }
        return folderNameList;
    }
    get fileNameList() {
        const fileNameList = [];
        for (let contentName of this.contentNameList) {
            if (fs_1.default.lstatSync(this.pathJoin(contentName)).isFile()) {
                fileNameList.push(contentName);
            }
        }
        return fileNameList;
    }
    get contentList() {
        return [...this.folderList, ...this.fileList];
    }
    get folderList() {
        const folderList = [];
        for (let folderName of this.folderNameList) {
            folderList.push(new Folder(this.pathJoin(folderName)));
        }
        return folderList;
    }
    get fileList() {
        const fileList = [];
        for (let fileName of this.fileNameList) {
            fileList.push(new __1.File(this.pathJoin(fileName)));
        }
        ;
        return fileList;
    }
    require() {
        if (this.fileNameList.includes("index.js")) {
            return new __1.File(this.pathJoin("index.js")).require();
        }
        throw new Error("This folder cannot be required!");
    }
    pathJoin(name) {
        return path_1.default.join(this.path, name);
    }
}
exports.Folder = Folder;
