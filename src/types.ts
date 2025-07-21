import { ChildProcess, SpawnOptions, StdioOptions } from "child_process";
import { SystemResult } from "./system-result";
import { SystemError } from "./system-error";

export type LogFunction = (s: string) => void;

export type ProcessIO = string | StringConsumer;
type StringConsumer = (data: string) => void;

export interface SystemOptions {
    windowsHide?: boolean;
    timeout?: number;
    argv0?: string;
    shell?: boolean | string;
    windowsVerbatimArguments?: boolean;

    uid?: number;
    gid?: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;

    stdout?: ProcessIO;
    stderr?: ProcessIO;

    detached?: boolean;

    /*
    * when a process is marked as interactive, no stderr/stdout
    * collection is done as the IO is left as "inherit"
     */
    interactive?: boolean;
    suppressStdIoInErrors?: boolean;

    /**
     * when set true, output will not be echoed back on the
     * console, but you will be able to get it from a custom
     * io writer or the result from after spawn completes
     */
    suppressOutput?: boolean;

    /**
     * when set to true, if a temporary file for launching your command was
     * required, it won't be cleaned up. It will appear in the spawn output
     * / error as the first argument, with the exe set to either cmd or sh
     */
    keepTempFiles?: boolean;

    // gain direct access to the child process as
    // soon as it spawns
    onChildSpawned?: (child: ChildProcess, originalOptions: SystemOptionsWithKill) => void;

    // when set to true, SystemError values will be _returned_ instead
    // of thrown
    noThrow?: boolean;
}

export interface SystemOptionsWithKill extends SystemOptions {
    // this function will be filled in for you once the
    // child process has started
    kill: (signal?: NodeJS.Signals | number) => void;
}

export interface StdIoCollectors {
    stdout: string[];
    stderr: string[];
}

export interface SpawnOptionsWithContext
    extends SpawnOptions, ExtraSpawnOptions {
    collectors: StdIoCollectors;
}

export type DebugLogFunction = (...args: any[]) => void;

export interface Dictionary<TValue> {
    [key: string]: TValue;
}
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export interface ExtraSpawnOptions {
    suppressOutput?: boolean;
    stderr?: StdioOptions;
    stdout?: StdioOptions;
    interactive?: boolean;
}

export interface SystemCommand {
    exe: string;
    args: string[];
}

export type SystemFunction = (program: string, args?: string[], options?: SystemOptions)
    => Promise<SystemResult | SystemError>;

export interface System
    extends SystemFunction {
    isError(o: any): o is SystemError;

    isResult(o: any): o is SystemResult;
}
