"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class File {
    constructor(path) {
        this.path = path;
    }
    get content() {
        return fs_1.default.readFileSync(this.path, 'utf8');
    }
    get extension() {
        return path_1.default.extname(this.path);
    }
    get basename() {
        return path_1.default.basename(this.path);
    }
    get name() {
        return this.basename.slice(0, -this.extension.length);
    }
    get requirePath() {
        return this.path.slice(0, -this.extension.length);
    }
    require() {
        return require(this.requirePath).default;
    }
}
exports.default = File;
