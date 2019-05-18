/// <reference path="../linq.d.ts" />
declare namespace wast {
    const whitespace: string;
    const keywords: string[];
    const types: string[];
    function highlight(wast: string): HTMLTableElement;
    class Escapes {
        comment: boolean;
        string: boolean;
        constructor(comment?: boolean, string?: boolean);
    }
}
