import * as _which_ from "which";
import { Dictionary, Optional } from "./types";

const cache = {} as Dictionary<string>;

export function which(
    executable: string
): Optional<string> {
    if (cache[executable]) {
        return cache[executable];
    }
    try {
        return cache[executable] = _which_.sync(executable);
    } catch (e) {
        return undefined;
    }
}
