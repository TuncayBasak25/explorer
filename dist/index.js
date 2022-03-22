"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = exports.File = void 0;
const file_1 = __importDefault(require("./core/file"));
exports.File = file_1.default;
const folder_1 = __importDefault(require("./core/folder"));
exports.Folder = folder_1.default;
