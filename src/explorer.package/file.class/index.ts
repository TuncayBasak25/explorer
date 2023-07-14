import fs from "fs";
import path from "path";
import { Mixin } from "ts-mixer";
import { Folder } from "../folder.class";
import Watcher from "../watcher.mixin";

export class File extends Mixin(Watcher) {

    public constructor(public readonly path: string) {
        super();
        if (!fs.existsSync(path)) {
            fs.appendFileSync(path, "");
        }
    }

    public require(): any {
        if (this.extension === '.js') {
            return require(this.path.slice(0, -3)).default;
        }
        if (this.extension === '.json') {
            return JSON.parse(this.content);
        }

        throw new Error("This file cannot be required!");
    }

    public delete(): void {
        fs.rmSync(this.path);
    }

    public get folder(): Folder {
        return new Folder(this.path.slice(0, this.basename.length + 1));
    }

    public get content(): string {
        return fs.readFileSync(this.path, 'utf8');
    }

    public set content(newContent: string) {
        fs.writeFileSync(this.path, newContent);
    }

    public get name(): string {
        return this.basename.slice(0, -this.extension.length);
    }

    public get basename(): string {
        return path.basename(this.path);
    }

    public get extension(): string {
        return path.extname(this.path);
    }
}