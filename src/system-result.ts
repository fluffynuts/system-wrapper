import { Optional } from "./types";

function splitIfNecessary(
    data: string[] | string
): string[] {
    if (Array.isArray(data)) {
        return [ ...data];
    }
    return data.split("\n")
        .map(line => line.replace(/\r$/, ""));
}

export class SystemResultBuilder {
    private _exe: string = "";
    private _args: string[] = [];
    private _exitCode: number = 0;
    private _stderr: string[] = [];
    private _stdout: string[] = [];

    private _mutators = [] as ((o: SystemResultBuilder) => void)[];

    public withExe(exe: string): SystemResultBuilder {
        return this.with(
            o => o._exe = exe
        );
    }

    public withArgs(args: string[]): SystemResultBuilder {
        return this.with(
            o => o._args = [ ...args ]
        );
    }

    public withExitCode(exitCode: number): SystemResultBuilder {
        return this.with(
            o => o._exitCode = exitCode
        );
    }

    public withStdErr(stderr: string[]): SystemResultBuilder {
        return this.with(
            o => o._stderr = splitIfNecessary(stderr)
        );
    }

    public withStdOut(stdout: string[]): SystemResultBuilder {
        return this.with(
            o => o._stdout = splitIfNecessary(stdout)
        );
    }

    public build(): SystemResult {
        for (const mutator of this._mutators) {
            mutator(this);
        }
        return new SystemResult(
            this._exe,
            this._args,
            this._exitCode,
            this._stderr,
            this._stdout
        );
    }

    private with(mutator: (o: SystemResultBuilder) => void): SystemResultBuilder {
        this._mutators.push(mutator);
        return this;
    }
}

export class SystemResult {
    public static create(): SystemResultBuilder {
        return new SystemResultBuilder();
    }

    public static isResult(o: any): o is SystemResult {
        return o instanceof SystemResult;
    }

    constructor(
        public exe: string,
        public args: string[],
        public exitCode: Optional<number>,
        public stderr: string[],
        public stdout: string[]
    ) {
    }

    public isResult(): this is SystemResult {
        return true;
    }
}
