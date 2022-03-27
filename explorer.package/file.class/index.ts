import fs from "fs";
import path from "path";
import { Folder } from "../folder.class";

export class File {
    public static readonly instances: { [key: string]: File } = {};

    private $content: string = "";

    public constructor(public readonly path: string) {
        if (!fs.existsSync(path)) {
            fs.appendFileSync(path, "");
        }
        if (!fs.lstatSync(path).isFile()) {
            throw new Error("The path specified has to be a file.");
        }
        if (File.instances[path]) {
            return File.instances[path];
        }
        else {
            File.instances[path] = this;
        }
    }

    public require(): any {
        if (this.extension === '.js') {
            return require(this.path.slice(0, -3)).default;
        }
        if (this.extension === '.json') {
            return JSON.parse(this.content);
        }
    }

    public get folder(): Folder {
        return new Folder(this.path.slice(0, this.basename.length + 1));
    }

    private updateContent: boolean = true;
    public get content(): string {
        if (this.updateContent) {
            this.$content = fs.readFileSync(this.path, 'utf8');
            this.updateContent = false;
        }
        return this.$content;
    }

    public set content(newContent: string) {
        this.$content = newContent;
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