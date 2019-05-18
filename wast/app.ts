/// <reference path="../linq.d.ts" />

namespace wast {

    export function highlight(wast: string) {
        if (TypeScript.logging.outputEverything) {
            console.log(wast);
        }
    }
}