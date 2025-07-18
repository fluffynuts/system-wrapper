import * as path from "path";
import { fileExistsSync } from "yafs";
import originalDebugFactory from "debug";
import { DebugLogFunction } from "./types";

function simplifyFilePath(label: string): string {
    if (!fileExistsSync(label)) {
        return label;
    }
    const
        basename = path.basename(label);
    return basename.replace(/\.(js|ts)$/i, "");
}

export function debugFactory(
    label: string
): DebugLogFunction {
    return originalDebugFactory(`zarro::${simplifyFilePath(label)}`);
}
