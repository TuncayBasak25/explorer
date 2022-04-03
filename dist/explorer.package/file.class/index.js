"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ts_mixer_1 = require("ts-mixer");
const folder_class_1 = require("../folder.class");
const watcher_mixin_1 = __importDefault(require("../watcher.mixin"));
class File extends (0, ts_mixer_1.Mixin)(watcher_mixin_1.default) {
    constructor(path) {
        super();
        this.path = path;
        this.$content = "";
        this.updateContent = true;
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.appendFileSync(path, "");
        }
    }
    require() {
        if (this.extension === '.js') {
            return require(this.path.slice(0, -3)).default;
        }
        if (this.extension === '.json') {
            return JSON.parse(this.content);
        }
        throw new Error("This file cannot be required!");
    }
    delete() {
        fs_1.default.rmSync(this.path);
    }
    get folder() {
        return new folder_class_1.Folder(this.path.slice(0, this.basename.length + 1));
    }
    get content() {
        if (this.updateContent) {
            this.$content = fs_1.default.readFileSync(this.path, 'utf8');
            this.updateContent = false;
        }
        return this.$content;
    }
    set content(newContent) {
        this.$content = newContent;
        fs_1.default.writeFileSync(this.path, newContent);
    }
    get name() {
        return this.basename.slice(0, -this.extension.length);
    }
    get basename() {
        return path_1.default.basename(this.path);
    }
    get extension() {
        return path_1.default.extname(this.path);
    }
}
exports.File = File;
