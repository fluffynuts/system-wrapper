system-wrapper
---
A wrapper around system calls, to make them easier to deal with, especially
on the I/O front.

usage
---

```javascript
import { system } from "system-wrapper";

// later
try {
    const result = await system("some-program", [ "arg1", "arg2", ... ], { /* options */ });
    for (const line of result.stdout) {
        // process output from command
    }
} catch (err: SystemError) {
    console.error(err.message, err.stderr, err.stdout);
}

// or
const result = await system("some-program", [ ... ], { noThrow: true });
if (system.isError(result) {
    console.error(result.message, result.stderr, result.stdout);
} else {
    for (const line of result.stdout) {
        // process output from command
    }
}
```

`system` will return a `SystemResult` when the process exits normally. This
result will, by default, have the program's `exitCode` and recorded `stdout`
and `stderr` attached as arrays of strings for easy manipulation of IO data. 
By default, all IO from the process is allowed through to console logging 
functions and will be echoed.

At the least, `system` requires a path to an executable program. Arguments
are an array of strings, and are _optional_.

Behavior can be modified by the _optional_ options object that can be passed
in as a third parameter. That object may define:

- argv0?: string
  - child_process option: explicitly set the argv0 for the process. Should
    not be required as this will be derived from the initial command.
- cwd?: string
  - child_process option to set the directory within which to start the process
- detached?: boolean
  - child_process option to set the child to run independently of the parent
- env?: Dictionary<string>
    - child_process option to set environment variables for the process
- gid?: number
    - child_process option to set the gid of the process via setgid
- interactive?: boolean
  - no stderr/stdout collection is done and IO is left as "inherit"
  - useful for interactive process launches which require input from
    the user
- keepTempFiles?: boolean
    - when true, if a temporary file was required to launch your command, it won't be
      cleaned up. It will appear in the spawn output  / error as the first argument,
      with the `exe` set to either `cmd` or `sh`
- noThrow?: boolean
    - when an error is encountered, _return_ the SystemError instead of throwing it
        - use system.isError to determine if the returned value is an error or a result
- onChildSpawned?: (child: ChildProcess, originalOptions: SystemOptionsWithKill) => void
    - gain direct access to the child process as it spawns
    - returned options will have a `kill` function added so you can kill the child
- shell?: boolean
    - child_process option: when true, runs the command within a shell
        - /bin/sh on linux, process.env.ComSpec on windows.
- stderr?: ProcessIO (string | (s: string) => void)
    - a string to pass to child_process for stderr (pipe/overlapped/ignore/inherit)
      or a function to accept string data per-line as it is emitted
- stdout?: ProcessIO (string | (s: string) => void)
    - a string to pass to child_process for stdout (pipe/overlapped/ignore/inherit)
      or a function to accept string data per-line as it is emitted
- suppressStdIoInErrors?: boolean
  - don't record stdio in output error objects
    - perhaps there's a lot of data you'd rather not keep in memory
    - perhaps you are already handling output with a stdout/stderr handler function
- suppressOutput?: boolean
  - when true, output will only be found on the returned SystemResult/SystemError
    and will not be echoed back to the console
- timeout?: number
    - child_process option: set a timeout for the process
        - node will take care of killing the process
- uid?: number
    - child_process option to set the uid of the process via setuid
- windowsHide?: boolean
    - on windows platforms, hide the process window - especially useful
      for wrapping console applications without a console flashing in and out
- windowsVerbatimArguments?: boolean
    - child_process option to prevent quoting of arguments (only applies to windows)
        - automatically set by node when `shell` is true and windows comspec is cmd
