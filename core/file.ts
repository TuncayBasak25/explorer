import fs from "fs";
import path from "path";

export default class File {
    public constructor(public readonly path: string) { }

    public get content(): string {
        return fs.readFileSync(this.path, 'utf8');
    }

    public get extension(): string {
        return path.extname(this.path);
    }

    public get basename(): string {
        return path.basename(this.path);
    }

    public get name(): string {
        return this.basename.slice(0, -this.extension.length);
    }

    public get requirePath(): string {
        return this.path.slice(0, -this.extension.length);
    }

    public require(): any {
        return require(this.requirePath).default;
    }
}