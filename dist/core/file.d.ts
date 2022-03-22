export default class File {
    readonly path: string;
    constructor(path: string);
    get content(): string;
    get extension(): string;
    get basename(): string;
    get name(): string;
    get requirePath(): string;
    require(): any;
}
//# sourceMappingURL=file.d.ts.map