"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("query");
var Types;
(function (Types) {
    Types[Types["Content"] = 0] = "Content";
    Types[Types["File"] = 1] = "File";
    Types[Types["Folder"] = 2] = "Folder";
})(Types || (Types = {}));
class Finder {
    getList(type) {
        switch (type) {
            case Types.Content: return this.contentList;
            case Types.Folder: return this.folderList;
            case Types.File: return this.fileList;
        }
    }
    find(type, conditions, recursive, recursiveDepth) {
        for (let content of this.getList(type)) {
            if ((0, query_1.testAny)(content, conditions)) {
                return content;
            }
        }
        if (recursive && recursiveDepth !== 0) {
            if (typeof recursiveDepth === 'number') {
                recursiveDepth--;
            }
            for (let folder of this.folderList) {
                const result = folder.find(type, conditions, recursive, recursiveDepth);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
    findMultiple(type, query, recursive, recursiveDepth) {
        const resultList = [];
        for (let content of this.getList(type)) {
            if ((0, query_1.testAny)(content, query.where || {})) {
                resultList.push(content);
            }
        }
        if (recursive && recursiveDepth !== 0) {
            if (typeof recursiveDepth === 'number') {
                recursiveDepth--;
            }
            for (let folder of this.folderList) {
                const result = folder.findMultiple(type, { where: query.where }, recursive, recursiveDepth);
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
    findOne(conditions = {}, recursive, recursiveDepth) {
        return this.find(Types.Content, conditions, recursive, recursiveDepth);
    }
    findFolder(conditions = {}, recursive, recursiveDepth) {
        return this.find(Types.Folder, conditions, recursive, recursiveDepth);
    }
    findFile(conditions = {}, recursive, recursiveDepth) {
        return this.find(Types.File, conditions, recursive, recursiveDepth);
    }
    findAll(query = {}, recursive, recursiveDepth) {
        return this.findMultiple(Types.Content, query, recursive, recursiveDepth);
    }
    findAllFolder(query = {}, recursive, recursiveDepth) {
        return this.findMultiple(Types.Folder, query, recursive, recursiveDepth);
    }
    findAllFile(query = {}, recursive, recursiveDepth) {
        return this.findMultiple(Types.File, query, recursive, recursiveDepth);
    }
}
exports.default = Finder;
